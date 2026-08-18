// REPOSITORY SOURCE: diplomat-bit/jocall3-python | PATH: diplomat-bit-jocall3-python-03825e0/src/jocall3/_utils/_streams.py
================================================================================

from typing import Any
from typing_extensions import Iterator, AsyncIterator


def consume_sync_iterator(iterator: Iterator[Any]) -> None:
    for _ in iterator:
        ...


async def consume_async_iterator(iterator: AsyncIterator[Any]) -> None:
    async for _ in iterator:
        ...
