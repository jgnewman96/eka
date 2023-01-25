"""
Script to serve backend.
"""

import argparse
import logging
import sys
from typing import Optional, Sequence, Text

from uvicorn import run


# pylint: disable=missing-docstring
def main(arguments: Optional[Sequence[Text]]) -> Optional[int]:

    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )

    parser.add_argument(
        "--host",
        help="Host on which to serve",
        type=str,
        required=True,
    )
    parser.add_argument(
        "--port",
        help="Port on which to serve",
        type=int,
        required=True,
    )
    args = parser.parse_args(arguments)
    logging.basicConfig(format="%(levelname)s:%(message)s", level=logging.DEBUG)

    run(
        "backend_server:app",
        host=args.host,
        port=args.port,
        log_level=logging.INFO,
        access_log=True,
        reload=True,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
