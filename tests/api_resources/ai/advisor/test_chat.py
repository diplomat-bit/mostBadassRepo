// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/tests/api_resources/ai/advisor/test_chat.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

import os
from typing import Any, cast

import pytest

from aibanking import Jocall3, AsyncJocall3
from tests.utils import assert_matches_type
from aibanking.types.ai.advisor import ChatCreateResponse, ChatRetrieveHistoryResponse

base_url = os.environ.get("TEST_API_BASE_URL", "http://127.0.0.1:4010")


class TestChat:
    parametrize = pytest.mark.parametrize("client", [False, True], indirect=True, ids=["loose", "strict"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_method_create(self, client: Jocall3) -> None:
        chat = client.ai.advisor.chat.create(
            message="string",
        )
        assert_matches_type(ChatCreateResponse, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_method_create_with_all_params(self, client: Jocall3) -> None:
        chat = client.ai.advisor.chat.create(
            message="string",
            context_account_ids=["string", "string"],
            mode="expert_financial",
            stream=False,
        )
        assert_matches_type(ChatCreateResponse, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_raw_response_create(self, client: Jocall3) -> None:
        response = client.ai.advisor.chat.with_raw_response.create(
            message="string",
        )

        assert response.is_closed is True
        assert response.http_request.headers.get("X-Stainless-Lang") == "python"
        chat = response.parse()
        assert_matches_type(ChatCreateResponse, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_streaming_response_create(self, client: Jocall3) -> None:
        with client.ai.advisor.chat.with_streaming_response.create(
            message="string",
        ) as response:
            assert not response.is_closed
            assert response.http_request.headers.get("X-Stainless-Lang") == "python"

            chat = response.parse()
            assert_matches_type(ChatCreateResponse, chat, path=["response"])

        assert cast(Any, response.is_closed) is True

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_method_retrieve_history(self, client: Jocall3) -> None:
        chat = client.ai.advisor.chat.retrieve_history()
        assert_matches_type(ChatRetrieveHistoryResponse, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_raw_response_retrieve_history(self, client: Jocall3) -> None:
        response = client.ai.advisor.chat.with_raw_response.retrieve_history()

        assert response.is_closed is True
        assert response.http_request.headers.get("X-Stainless-Lang") == "python"
        chat = response.parse()
        assert_matches_type(ChatRetrieveHistoryResponse, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_streaming_response_retrieve_history(self, client: Jocall3) -> None:
        with client.ai.advisor.chat.with_streaming_response.retrieve_history() as response:
            assert not response.is_closed
            assert response.http_request.headers.get("X-Stainless-Lang") == "python"

            chat = response.parse()
            assert_matches_type(ChatRetrieveHistoryResponse, chat, path=["response"])

        assert cast(Any, response.is_closed) is True


class TestAsyncChat:
    parametrize = pytest.mark.parametrize(
        "async_client", [False, True, {"http_client": "aiohttp"}], indirect=True, ids=["loose", "strict", "aiohttp"]
    )

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_method_create(self, async_client: AsyncJocall3) -> None:
        chat = await async_client.ai.advisor.chat.create(
            message="string",
        )
        assert_matches_type(ChatCreateResponse, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_method_create_with_all_params(self, async_client: AsyncJocall3) -> None:
        chat = await async_client.ai.advisor.chat.create(
            message="string",
            context_account_ids=["string", "string"],
            mode="expert_financial",
            stream=False,
        )
        assert_matches_type(ChatCreateResponse, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_raw_response_create(self, async_client: AsyncJocall3) -> None:
        response = await async_client.ai.advisor.chat.with_raw_response.create(
            message="string",
        )

        assert response.is_closed is True
        assert response.http_request.headers.get("X-Stainless-Lang") == "python"
        chat = await response.parse()
        assert_matches_type(ChatCreateResponse, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_streaming_response_create(self, async_client: AsyncJocall3) -> None:
        async with async_client.ai.advisor.chat.with_streaming_response.create(
            message="string",
        ) as response:
            assert not response.is_closed
            assert response.http_request.headers.get("X-Stainless-Lang") == "python"

            chat = await response.parse()
            assert_matches_type(ChatCreateResponse, chat, path=["response"])

        assert cast(Any, response.is_closed) is True

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_method_retrieve_history(self, async_client: AsyncJocall3) -> None:
        chat = await async_client.ai.advisor.chat.retrieve_history()
        assert_matches_type(ChatRetrieveHistoryResponse, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_raw_response_retrieve_history(self, async_client: AsyncJocall3) -> None:
        response = await async_client.ai.advisor.chat.with_raw_response.retrieve_history()

        assert response.is_closed is True
        assert response.http_request.headers.get("X-Stainless-Lang") == "python"
        chat = await response.parse()
        assert_matches_type(ChatRetrieveHistoryResponse, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_streaming_response_retrieve_history(self, async_client: AsyncJocall3) -> None:
        async with async_client.ai.advisor.chat.with_streaming_response.retrieve_history() as response:
            assert not response.is_closed
            assert response.http_request.headers.get("X-Stainless-Lang") == "python"

            chat = await response.parse()
            assert_matches_type(ChatRetrieveHistoryResponse, chat, path=["response"])

        assert cast(Any, response.is_closed) is True


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-python | ORIGINAL PATH: diplomat-bit-jocall3-python-03825e0/tests/api_resources/ai/advisor/test_chat.py
================================================================================

# File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

from __future__ import annotations

import os
from typing import Any, cast

import pytest

from jocall3 import Jocall3, AsyncJocall3
from tests.utils import assert_matches_type

base_url = os.environ.get("TEST_API_BASE_URL", "http://127.0.0.1:4010")


class TestChat:
    parametrize = pytest.mark.parametrize("client", [False, True], indirect=True, ids=["loose", "strict"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_method_retrieve_history(self, client: Jocall3) -> None:
        chat = client.ai.advisor.chat.retrieve_history()
        assert_matches_type(object, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_method_retrieve_history_with_all_params(self, client: Jocall3) -> None:
        chat = client.ai.advisor.chat.retrieve_history(
            limit=0,
            offset=0,
            session_id="sessionId",
        )
        assert_matches_type(object, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_raw_response_retrieve_history(self, client: Jocall3) -> None:
        response = client.ai.advisor.chat.with_raw_response.retrieve_history()

        assert response.is_closed is True
        assert response.http_request.headers.get("X-Stainless-Lang") == "python"
        chat = response.parse()
        assert_matches_type(object, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_streaming_response_retrieve_history(self, client: Jocall3) -> None:
        with client.ai.advisor.chat.with_streaming_response.retrieve_history() as response:
            assert not response.is_closed
            assert response.http_request.headers.get("X-Stainless-Lang") == "python"

            chat = response.parse()
            assert_matches_type(object, chat, path=["response"])

        assert cast(Any, response.is_closed) is True

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_method_send_message(self, client: Jocall3) -> None:
        chat = client.ai.advisor.chat.send_message()
        assert_matches_type(object, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_method_send_message_with_all_params(self, client: Jocall3) -> None:
        chat = client.ai.advisor.chat.send_message(
            function_response={},
        )
        assert_matches_type(object, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_raw_response_send_message(self, client: Jocall3) -> None:
        response = client.ai.advisor.chat.with_raw_response.send_message()

        assert response.is_closed is True
        assert response.http_request.headers.get("X-Stainless-Lang") == "python"
        chat = response.parse()
        assert_matches_type(object, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    def test_streaming_response_send_message(self, client: Jocall3) -> None:
        with client.ai.advisor.chat.with_streaming_response.send_message() as response:
            assert not response.is_closed
            assert response.http_request.headers.get("X-Stainless-Lang") == "python"

            chat = response.parse()
            assert_matches_type(object, chat, path=["response"])

        assert cast(Any, response.is_closed) is True


class TestAsyncChat:
    parametrize = pytest.mark.parametrize(
        "async_client", [False, True, {"http_client": "aiohttp"}], indirect=True, ids=["loose", "strict", "aiohttp"]
    )

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_method_retrieve_history(self, async_client: AsyncJocall3) -> None:
        chat = await async_client.ai.advisor.chat.retrieve_history()
        assert_matches_type(object, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_method_retrieve_history_with_all_params(self, async_client: AsyncJocall3) -> None:
        chat = await async_client.ai.advisor.chat.retrieve_history(
            limit=0,
            offset=0,
            session_id="sessionId",
        )
        assert_matches_type(object, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_raw_response_retrieve_history(self, async_client: AsyncJocall3) -> None:
        response = await async_client.ai.advisor.chat.with_raw_response.retrieve_history()

        assert response.is_closed is True
        assert response.http_request.headers.get("X-Stainless-Lang") == "python"
        chat = await response.parse()
        assert_matches_type(object, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_streaming_response_retrieve_history(self, async_client: AsyncJocall3) -> None:
        async with async_client.ai.advisor.chat.with_streaming_response.retrieve_history() as response:
            assert not response.is_closed
            assert response.http_request.headers.get("X-Stainless-Lang") == "python"

            chat = await response.parse()
            assert_matches_type(object, chat, path=["response"])

        assert cast(Any, response.is_closed) is True

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_method_send_message(self, async_client: AsyncJocall3) -> None:
        chat = await async_client.ai.advisor.chat.send_message()
        assert_matches_type(object, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_method_send_message_with_all_params(self, async_client: AsyncJocall3) -> None:
        chat = await async_client.ai.advisor.chat.send_message(
            function_response={},
        )
        assert_matches_type(object, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_raw_response_send_message(self, async_client: AsyncJocall3) -> None:
        response = await async_client.ai.advisor.chat.with_raw_response.send_message()

        assert response.is_closed is True
        assert response.http_request.headers.get("X-Stainless-Lang") == "python"
        chat = await response.parse()
        assert_matches_type(object, chat, path=["response"])

    @pytest.mark.skip(reason="Prism tests are disabled")
    @parametrize
    async def test_streaming_response_send_message(self, async_client: AsyncJocall3) -> None:
        async with async_client.ai.advisor.chat.with_streaming_response.send_message() as response:
            assert not response.is_closed
            assert response.http_request.headers.get("X-Stainless-Lang") == "python"

            chat = await response.parse()
            assert_matches_type(object, chat, path=["response"])

        assert cast(Any, response.is_closed) is True
