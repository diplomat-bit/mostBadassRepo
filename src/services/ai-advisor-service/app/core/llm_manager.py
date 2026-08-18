// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/ai-advisor-service/app/core/llm_manager.py
================================================================================

import os
import logging
from abc import ABC, abstractmethod
from typing import Any, Dict, List, AsyncGenerator, Optional, Type, Union
from enum import Enum

# Third-party libraries
import openai
import google.generativeai as genai
import anthropic
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from pydantic import BaseModel

# Local imports
# Assuming a central config file exists at app.core.config
# This allows for centralized management of API keys and model names.
from app.core.config import settings

# --- Setup Logging ---
logger = logging.getLogger(__name__)

# --- Custom Exceptions ---
class LLMError(Exception):
    """Base exception for LLM related errors."""
    pass

class ProviderNotFoundError(LLMError):
    """Raised when a requested LLM provider is not found."""
    pass

class APIKeyMissingError(LLMError):
    """Raised when an API key for a provider is not configured."""
    pass

class LLMGenerationError(LLMError):
    """Raised when the LLM fails to generate a response."""
    pass

# --- Data Models ---
class Message(BaseModel):
    """Represents a single message in a conversation."""
    role: str  # e.g., "user", "assistant", "system"
    content: str

class LLMResponse(BaseModel):
    """Standardized response object from an LLM."""
    content: str
    provider: str
    model: str
    usage: Optional[Dict[str, int]] = None # e.g., {"prompt_tokens": 10, "completion_tokens": 20}
    stop_reason: Optional[str] = None

class LLMProviderEnum(str, Enum):
    """Enumeration of supported LLM providers."""
    OPENAI = "openai"
    GOOGLE = "google"
    ANTHROPIC = "anthropic"
    # Add more providers here as they are integrated
    # AWS_BEDROCK = "aws_bedrock"
    # GCP_VERTEXAI = "gcp_vertexai"

# --- Abstract Base Class for LLM Providers ---
class LLMProvider(ABC):
    """Abstract base class for all LLM provider integrations."""

    def __init__(self, api_key: str, model: str):
        if not api_key:
            raise APIKeyMissingError(f"API key for {self.__class__.__name__} is missing.")
        self.api_key = api_key
        self.model = model
        self._setup_client()

    @abstractmethod
    def _setup_client(self) -> None:
        """Sets up the specific API client for the provider."""
        pass

    @abstractmethod
    async def generate_response(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs: Any
    ) -> LLMResponse:
        """Generates a non-streaming response from the LLM."""
        pass

    @abstractmethod
    async def generate_streaming_response(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs: Any
    ) -> AsyncGenerator[str, None]:
        """Generates a streaming response from the LLM, yielding text chunks."""
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Returns the name of the provider."""
        pass

# --- Concrete Provider Implementations ---

class OpenAIProvider(LLMProvider):
    """OpenAI GPT models provider."""
    provider_name = LLMProviderEnum.OPENAI.value
    client: openai.AsyncOpenAI

    def _setup_client(self) -> None:
        self.client = openai.AsyncOpenAI(api_key=self.api_key)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        retry=retry_if_exception_type((openai.APIError, openai.Timeout, openai.RateLimitError)),
        reraise=True
    )
    async def generate_response(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs: Any
    ) -> LLMResponse:
        try:
            chat_messages = [msg.model_dump() for msg in messages]
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=chat_messages,
                temperature=temperature,
                max_tokens=max_tokens,
                **kwargs
            )
            choice = response.choices[0]
            return LLMResponse(
                content=choice.message.content or "",
                provider=self.provider_name,
                model=self.model,
                usage=response.usage.model_dump() if response.usage else None,
                stop_reason=choice.finish_reason
            )
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise LLMGenerationError(f"Failed to generate response from OpenAI: {e}") from e

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        retry=retry_if_exception_type((openai.APIError, openai.Timeout, openai.RateLimitError)),
        reraise=True
    )
    async def generate_streaming_response(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs: Any
    ) -> AsyncGenerator[str, None]:
        try:
            chat_messages = [msg.model_dump() for msg in messages]
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=chat_messages,
                temperature=temperature,
                max_tokens=max_tokens,
                stream=True,
                **kwargs
            )
            async for chunk in stream:
                content = chunk.choices[0].delta.content
                if content:
                    yield content
        except Exception as e:
            logger.error(f"OpenAI streaming API error: {e}")
            raise LLMGenerationError(f"Failed to generate streaming response from OpenAI: {e}") from e


class GoogleGeminiProvider(LLMProvider):
    """Google Gemini models provider."""
    provider_name = LLMProviderEnum.GOOGLE.value
    client: genai.GenerativeModel

    def _setup_client(self) -> None:
        genai.configure(api_key=self.api_key)
        self.client = genai.GenerativeModel(self.model)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        reraise=True
    )
    async def generate_response(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs: Any
    ) -> LLMResponse:
        try:
            # Gemini has a different message format (no system prompt, alternating user/model)
            # This is a simplified conversion. A more robust one would handle history better.
            prompt = "\n".join([f"{msg.role}: {msg.content}" for msg in messages])
            generation_config = genai.types.GenerationConfig(
                max_output_tokens=max_tokens,
                temperature=temperature,
            )
            response = await self.client.generate_content_async(
                prompt,
                generation_config=generation_config,
                **kwargs
            )
            return LLMResponse(
                content=response.text,
                provider=self.provider_name,
                model=self.model,
                # Usage data might need to be retrieved differently if available
                usage=None,
                stop_reason=str(response.prompt_feedback.block_reason) if response.prompt_feedback else None
            )
        except Exception as e:
            logger.error(f"Google Gemini API error: {e}")
            raise LLMGenerationError(f"Failed to generate response from Google Gemini: {e}") from e

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        reraise=True
    )
    async def generate_streaming_response(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs: Any
    ) -> AsyncGenerator[str, None]:
        try:
            prompt = "\n".join([f"{msg.role}: {msg.content}" for msg in messages])
            generation_config = genai.types.GenerationConfig(
                max_output_tokens=max_tokens,
                temperature=temperature,
            )
            stream = await self.client.generate_content_async(
                prompt,
                generation_config=generation_config,
                stream=True,
                **kwargs
            )
            async for chunk in stream:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            logger.error(f"Google Gemini streaming API error: {e}")
            raise LLMGenerationError(f"Failed to generate streaming response from Google Gemini: {e}") from e


class AnthropicClaudeProvider(LLMProvider):
    """Anthropic Claude models provider."""
    provider_name = LLMProviderEnum.ANTHROPIC.value
    client: anthropic.AsyncAnthropic

    def _setup_client(self) -> None:
        self.client = anthropic.AsyncAnthropic(api_key=self.api_key)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        retry=retry_if_exception_type((anthropic.APIError, anthropic.RateLimitError)),
        reraise=True
    )
    async def generate_response(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs: Any
    ) -> LLMResponse:
        try:
            # Claude API has a specific format for messages and system prompts
            system_prompt = next((msg.content for msg in messages if msg.role == "system"), None)
            user_assistant_messages = [msg.model_dump() for msg in messages if msg.role != "system"]

            response = await self.client.messages.create(
                model=self.model,
                system=system_prompt,
                messages=user_assistant_messages,
                temperature=temperature,
                max_tokens=max_tokens,
                **kwargs
            )
            return LLMResponse(
                content=response.content[0].text,
                provider=self.provider_name,
                model=self.model,
                usage={
                    "prompt_tokens": response.usage.input_tokens,
                    "completion_tokens": response.usage.output_tokens,
                },
                stop_reason=response.stop_reason
            )
        except Exception as e:
            logger.error(f"Anthropic API error: {e}")
            raise LLMGenerationError(f"Failed to generate response from Anthropic: {e}") from e

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=4, max=10),
        retry=retry_if_exception_type((anthropic.APIError, anthropic.RateLimitError)),
        reraise=True
    )
    async def generate_streaming_response(
        self,
        messages: List[Message],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs: Any
    ) -> AsyncGenerator[str, None]:
        try:
            system_prompt = next((msg.content for msg in messages if msg.role == "system"), None)
            user_assistant_messages = [msg.model_dump() for msg in messages if msg.role != "system"]

            async with self.client.messages.stream(
                model=self.model,
                system=system_prompt,
                messages=user_assistant_messages,
                temperature=temperature,
                max_tokens=max_tokens,
                **kwargs
            ) as stream:
                async for text in stream.text_stream:
                    yield text
        except Exception as e:
            logger.error(f"Anthropic streaming API error: {e}")
            raise LLMGenerationError(f"Failed to generate streaming response from Anthropic: {e}") from e


# --- Prompt Engineering ---
class PromptTemplate:
    """A simple class for managing and formatting prompt templates."""

    def __init__(self, template: str):
        self.template = template

    def format(self, **kwargs: Any) -> str:
        """Formats the template with the given keyword arguments."""
        try:
            return self.template.format(**kwargs)
        except KeyError as e:
            raise ValueError(f"Missing variable in prompt template: {e}") from e

    def to_user_message(self, **kwargs: Any) -> Message:
        """Formats the template and returns a user Message object."""
        return Message(role="user", content=self.format(**kwargs))

# --- LLM Manager ---
class LLMManager:
    """
    Manages interactions with various LLM providers.
    Acts as a factory and a central point of control for LLM calls.
    """
    _providers: Dict[str, LLMProvider] = {}
    _provider_classes: Dict[str, Type[LLMProvider]] = {
        LLMProviderEnum.OPENAI.value: OpenAIProvider,
        LLMProviderEnum.GOOGLE.value: GoogleGeminiProvider,
        LLMProviderEnum.ANTHROPIC.value: AnthropicClaudeProvider,
    }

    def __init__(self):
        self._load_providers_from_config()

    def _load_providers_from_config(self):
        """Initializes configured LLM providers based on application settings."""
        if settings.OPENAI_API_KEY and settings.OPENAI_DEFAULT_MODEL:
            self.register_provider(
                LLMProviderEnum.OPENAI.value,
                api_key=settings.OPENAI_API_KEY,
                model=settings.OPENAI_DEFAULT_MODEL
            )
        if settings.GOOGLE_API_KEY and settings.GOOGLE_DEFAULT_MODEL:
            self.register_provider(
                LLMProviderEnum.GOOGLE.value,
                api_key=settings.GOOGLE_API_KEY,
                model=settings.GOOGLE_DEFAULT_MODEL
            )
        if settings.ANTHROPIC_API_KEY and settings.ANTHROPIC_DEFAULT_MODEL:
            self.register_provider(
                LLMProviderEnum.ANTHROPIC.value,
                api_key=settings.ANTHROPIC_API_KEY,
                model=settings.ANTHROPIC_DEFAULT_MODEL
            )
        logger.info(f"Initialized LLM providers: {list(self._providers.keys())}")

    def register_provider(self, name: str, api_key: str, model: str):
        """Registers and initializes a new provider instance."""
        if name not in self._provider_classes:
            raise ProviderNotFoundError(f"Provider class for '{name}' not found.")
        try:
            provider_class = self._provider_classes[name]
            self._providers[name] = provider_class(api_key=api_key, model=model)
            logger.info(f"Successfully registered LLM provider: {name}")
        except APIKeyMissingError:
            logger.warning(f"API key for {name} is missing. Provider not registered.")
        except Exception as e:
            logger.error(f"Failed to register provider {name}: {e}")

    def get_provider(self, name: Optional[str] = None) -> LLMProvider:
        """
        Retrieves a provider instance.
        If name is None, returns the default provider from settings.
        """
        if name is None:
            name = settings.DEFAULT_LLM_PROVIDER
        
        provider = self._providers.get(name)
        if not provider:
            raise ProviderNotFoundError(f"Provider '{name}' is not configured or available.")
        return provider

    async def generate(
        self,
        messages: List[Message],
        provider: Optional[Union[LLMProviderEnum, str]] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
        stream: bool = False,
        **kwargs: Any
    ) -> Union[LLMResponse, AsyncGenerator[str, None]]:
        """
        The main method to generate a response from an LLM.
        It can handle both streaming and non-streaming requests.
        Allows overriding the default provider and model.
        """
        provider_name = provider.value if isinstance(provider, Enum) else provider
        llm_provider = self.get_provider(provider_name)

        # Override model if specified
        if model:
            # Create a temporary instance with the new model
            # A more sophisticated approach might involve a pool of clients
            temp_provider = self._provider_classes[llm_provider.provider_name](
                api_key=llm_provider.api_key,
                model=model
            )
            llm_provider = temp_provider

        if stream:
            return llm_provider.generate_streaming_response(
                messages, temperature, max_tokens, **kwargs
            )
        else:
            return await llm_provider.generate_response(
                messages, temperature, max_tokens, **kwargs
            )

    async def route_and_generate(
        self,
        messages: List[Message],
        task_description: str,
        **kwargs: Any
    ) -> Union[LLMResponse, AsyncGenerator[str, None]]:
        """
        Advanced generation method that routes the request to the best provider/model.
        (This is a placeholder for more complex routing logic).
        
        Routing logic could be based on:
        - Cost
        - Latency requirements
        - Required model capabilities (e.g., vision, code generation)
        - Current provider health/status
        """
        # Simple routing logic: use a powerful model for "complex" tasks
        if "complex" in task_description.lower() or "reasoning" in task_description.lower():
            # Prefer Claude 3 Opus or GPT-4 if available
            if LLMProviderEnum.ANTHROPIC.value in self._providers and settings.ANTHROPIC_POWERFUL_MODEL:
                provider_name = LLMProviderEnum.ANTHROPIC.value
                model = settings.ANTHROPIC_POWERFUL_MODEL
            elif LLMProviderEnum.OPENAI.value in self._providers and settings.OPENAI_POWERFUL_MODEL:
                provider_name = LLMProviderEnum.OPENAI.value
                model = settings.OPENAI_POWERFUL_MODEL
            else:
                provider_name = settings.DEFAULT_LLM_PROVIDER
                model = None # Use default model
        else:
            # Use a faster, cheaper model for simple tasks
            provider_name = settings.DEFAULT_LLM_PROVIDER
            model = None # Use default model

        logger.info(f"Routing task '{task_description}' to provider: {provider_name}, model: {model or 'default'}")
        
        return await self.generate(messages, provider=provider_name, model=model, **kwargs)


# --- Singleton Instance ---
# This makes it easy to access the manager from anywhere in the app
# without passing it around or using dependency injection frameworks for simple cases.
llm_manager = LLMManager()