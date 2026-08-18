// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/src/aibanking/_utils/_streams.py
================================================================================

from typing import Any
from typing_extensions import Iterator, AsyncIterator


def consume_sync_iterator(iterator: Iterator[Any]) -> None:
    for _ in iterator:
        ...


async def consume_async_iterator(iterator: AsyncIterator[Any]) -> None:
    async for _ in iterator:
        ...
