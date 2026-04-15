@echo off
set TFHUB_CACHE_DIR=%CD%\tfhub_cache
uvicorn app:app --reload --port 8000