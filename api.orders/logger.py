import logging
import os
import structlog

# Create a logs directory if it doesn't exist
log_directory = "logs"
if not os.path.exists(log_directory):
    os.makedirs(log_directory)

# File log path
log_file_path = os.path.join(log_directory, "app.log")

# Set up standard Python logging to log to both file and console
logging.basicConfig(
    level=logging.INFO,  # Set the logging level
    format="%(message)s",  # Log message format
    handlers=[
        logging.FileHandler(log_file_path),  # Log to a file
        logging.StreamHandler(),  # Log to console (stdout)
    ],
)

# Configure structlog to use standard Python logging
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),  # Add timestamp to logs
        structlog.stdlib.filter_by_level,  # Filter logs by logging level
        structlog.stdlib.add_logger_name,  # Add logger name to log
        structlog.stdlib.add_log_level,  # Add log level to log
        structlog.processors.StackInfoRenderer(),  # Add stack info if available
        structlog.processors.format_exc_info,  # Format exception info
        structlog.processors.JSONRenderer(),  # Output logs as JSON (optional)
    ],
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

# Create a logger
logger = structlog.get_logger()
