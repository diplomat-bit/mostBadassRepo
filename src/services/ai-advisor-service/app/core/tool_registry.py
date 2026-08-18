// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/ai-advisor-service/app/core/tool_registry.py
================================================================================

"""
Tool Registry for AI Advisor Service

This module provides a centralized registry for defining and managing "tools" -
functions that can be invoked by a Large Language Model (LLM). The registry is
designed to be extensible, secure, and self-documenting.

Key Features:
- A decorator-based approach for easy registration of functions as tools.
- Automatic generation of JSON schemas compatible with major LLM APIs (e.g., OpenAI, Anthropic).
- Use of Pydantic for robust argument validation and schema definition.
- Support for both synchronous and asynchronous tool functions.
- Metadata support for categorization, permissions (scopes), and associated services.
- Centralized execution logic with error handling.

Example Usage:
----------------
from pydantic import BaseModel, Field
from .tool_registry import tool_registry

class GetWeatherArgs(BaseModel):
    location: str = Field(..., description="The city and state, e.g., San Francisco, CA")
    unit: str = Field(default="celsius", description="The temperature unit (celsius or fahrenheit)")

@tool_registry.register(
    name="get_current_weather",
    description="Get the current weather in a given location.",
    category="Data Fetching",
    required_scopes=["weather:read"]
)
async def get_current_weather(args: GetWeatherArgs) -> dict:
    # ... implementation to call a weather API ...
    return {"location": args.location, "temperature": "22", "unit": args.unit}

# To get all schemas for the LLM:
all_schemas = tool_registry.get_all_tool_schemas()

# To execute a tool based on LLM output:
result = await tool_registry.execute_tool(
    name="get_current_weather",
    arguments={"location": "Boston, MA"}
)
"""

import asyncio
import inspect
from typing import Any, Callable, Coroutine, Dict, List, Set, Type, Union

from pydantic import BaseModel, Field, create_model
from pydantic.json_schema import GenerateJsonSchema

# --- Custom Exceptions ---

class ToolRegistryError(Exception):
    """Base exception for tool registry errors."""
    pass

class ToolNotFound(ToolRegistryError):
    """Raised when a requested tool is not found in the registry."""
    def __init__(self, tool_name: str):
        super().__init__(f"Tool '{tool_name}' not found in the registry.")
        self.tool_name = tool_name

class ToolExecutionError(ToolRegistryError):
    """Raised when an error occurs during tool execution."""
    def __init__(self, tool_name: str, original_exception: Exception):
        super().__init__(f"Error executing tool '{tool_name}': {original_exception}")
        self.tool_name = tool_name
        self.original_exception = original_exception

class ToolRegistrationError(ToolRegistryError):
    """Raised when there's an issue registering a tool."""
    pass


# --- Pydantic Models for Tool Schema (OpenAI Compatible) ---

class ToolParameterProperties(BaseModel):
    """Defines the properties of a single parameter within a tool's parameters."""
    type: str = Field(..., description="The data type of the parameter (e.g., 'string', 'number').")
    description: str = Field("", description="A description of what the parameter is for.")
    enum: List[str] = Field(default_factory=list, description="A list of allowed values for the parameter.")

    class Config:
        extra = 'allow' # Allow other JSON schema properties like 'items' for arrays

class ToolParameters(BaseModel):
    """Defines the schema for the parameters a tool accepts."""
    type: str = Field("object", description="The type of the parameter schema, always 'object'.")
    properties: Dict[str, ToolParameterProperties] = Field(
        ...,
        description="A dictionary mapping parameter names to their property definitions."
    )
    required: List[str] = Field(
        default_factory=list,
        description="A list of parameter names that are required."
    )

class ToolDefinition(BaseModel):
    """Represents the complete definition of a tool for the LLM."""
    name: str = Field(..., description="The name of the function to be called.")
    description: str = Field(..., description="A detailed description of what the function does.")
    parameters: ToolParameters = Field(
        ...,
        description="The JSON schema for the function's parameters."
    )

class RegisteredTool:
    """A container for a registered tool's data."""
    def __init__(
        self,
        func: Callable[..., Any],
        schema: ToolDefinition,
        category: str,
        required_scopes: Set[str],
        argument_model: Type[BaseModel]
    ):
        self.func = func
        self.schema = schema
        self.category = category
        self.required_scopes = required_scopes
        self.argument_model = argument_model
        self.is_async = asyncio.iscoroutinefunction(func)

    def __repr__(self) -> str:
        return f"<RegisteredTool name='{self.schema.name}' category='{self.category}'>"


# --- The Main Tool Registry Class ---

class ToolRegistry:
    """
    A registry for managing and executing functions as tools for an LLM.
    """
    def __init__(self):
        self._tools: Dict[str, RegisteredTool] = {}

    def register(
        self,
        name: str,
        description: str,
        category: str = "General",
        required_scopes: List[str] = None
    ) -> Callable:
        """
        A decorator to register a function as an LLM-callable tool.

        The decorated function must have a single argument, which is a Pydantic
        BaseModel that defines the tool's expected parameters.

        Args:
            name: The name of the tool, as it will be presented to the LLM.
            description: A clear, concise description of the tool's purpose.
            category: A category for organizing tools (e.g., 'Plaid', 'AWS', 'User Management').
            required_scopes: A list of OAuth-style scopes required to execute this tool.
        """
        def decorator(func: Callable) -> Callable:
            try:
                sig = inspect.signature(func)
                params = list(sig.parameters.values())

                if not params:
                    # If the function takes no arguments, create an empty Pydantic model
                    argument_model = create_model(f"{name}Args", __base__=BaseModel)
                elif len(params) == 1 and isinstance(params[0].annotation, type) and issubclass(params[0].annotation, BaseModel):
                    argument_model = params[0].annotation
                else:
                    raise ToolRegistrationError(
                        f"Tool function '{func.__name__}' must have exactly one "
                        "argument that is a Pydantic BaseModel, or no arguments."
                    )

                # Generate JSON schema from the Pydantic model
                schema_generator = GenerateJsonSchema()
                json_schema = argument_model.model_json_schema(schema_generator=schema_generator)

                # Remove title and description from the top-level schema if they exist
                json_schema.pop('title', None)
                json_schema.pop('description', None)

                tool_schema = ToolDefinition(
                    name=name,
                    description=description,
                    parameters=ToolParameters.model_validate(json_schema)
                )

                if name in self._tools:
                    # This could be a warning or an error depending on desired behavior
                    # For now, we'll raise an error to prevent accidental overwrites.
                    raise ToolRegistrationError(f"Tool with name '{name}' is already registered.")

                registered_tool = RegisteredTool(
                    func=func,
                    schema=tool_schema,
                    category=category,
                    required_scopes=set(required_scopes or []),
                    argument_model=argument_model
                )

                self._tools[name] = registered_tool

            except Exception as e:
                # Wrap any exception during registration for better debugging
                raise ToolRegistrationError(f"Failed to register tool '{name}': {e}") from e

            return func
        return decorator

    def get_tool(self, name: str) -> RegisteredTool:
        """
        Retrieves a registered tool by its name.

        Args:
            name: The name of the tool to retrieve.

        Returns:
            The RegisteredTool object.

        Raises:
            ToolNotFound: If no tool with the given name is registered.
        """
        tool = self._tools.get(name)
        if not tool:
            raise ToolNotFound(tool_name=name)
        return tool

    def get_all_tool_schemas(self, categories: List[str] = None) -> List[Dict[str, Any]]:
        """
        Returns the JSON schemas of all registered tools, optionally filtered by category.

        Args:
            categories: An optional list of categories to filter by.

        Returns:
            A list of tool schemas in a dictionary format suitable for LLM APIs.
        """
        schemas = []
        for tool in self._tools.values():
            if categories is None or tool.category in categories:
                schemas.append(tool.schema.model_dump(exclude_none=True))
        return schemas

    async def execute_tool(self, name: str, arguments: Dict[str, Any]) -> Any:
        """
        Executes a registered tool with the given arguments.

        This method validates the arguments against the tool's Pydantic model
        and calls the underlying function, handling both sync and async functions.

        Args:
            name: The name of the tool to execute.
            arguments: A dictionary of arguments for the tool.

        Returns:
            The result of the tool's execution.

        Raises:
            ToolNotFound: If the tool is not registered.
            ToolExecutionError: If argument validation fails or the tool function raises an exception.
        """
        try:
            tool = self.get_tool(name)

            # Validate arguments by creating an instance of the Pydantic model
            validated_args = tool.argument_model.model_validate(arguments)

            # Execute the function
            if tool.is_async:
                # The function is an async coroutine
                if len(inspect.signature(tool.func).parameters) > 0:
                    result = await tool.func(validated_args)
                else:
                    result = await tool.func()
            else:
                # The function is a standard synchronous function
                if len(inspect.signature(tool.func).parameters) > 0:
                    result = tool.func(validated_args)
                else:
                    result = tool.func()

            return result

        except ToolNotFound:
            raise # Re-raise the specific exception
        except Exception as e:
            # Catch any other exception (validation, runtime error in tool)
            # and wrap it in a ToolExecutionError
            raise ToolExecutionError(tool_name=name, original_exception=e)

    def list_tools(self) -> List[Dict[str, Any]]:
        """
        Provides a summary list of all registered tools.
        """
        return [
            {
                "name": tool.schema.name,
                "description": tool.schema.description,
                "category": tool.category,
                "required_scopes": list(tool.required_scopes),
                "is_async": tool.is_async
            }
            for tool in self._tools.values()
        ]


# --- Global Singleton Instance ---
# This instance can be imported and used throughout the application to register
# and execute tools, ensuring a single source of truth.
tool_registry = ToolRegistry()