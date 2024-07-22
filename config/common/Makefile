export
SHELL := bash

# Define colors
COLOR_GREEN := \033[32m
COLOR_YELLOW := \033[33m
COLOR_BLUE := \033[34m
COLOR_MAGENTA := \033[35m
COLOR_RESET := \033[0m

# Disable echo
.SILENT:

# Current makefile
CURRENT_MAKEFILE := $(firstword $(MAKEFILE_LIST))
# Disable parallelization
.NOTPARALLEL:
# Default target
.DEFAULT_GOAL := help
.PHONY: help
help:
	@grep -hE '^[a-zA-Z0-9_-]+:.*?##.*?$$|^##.*$$' $(MAKEFILE_LIST) | \
	awk 'BEGIN {FS = ":.*?## "}{ \
		if ($$0 ~ /^##/) { \
			gsub(/^## /, "", $$0); \
			printf "$(COLOR_YELLOW)%s$(COLOR_RESET)\n", $$0; \
		} else if ($$2 ~ /##ARG$$/) { \
			desc = $$2; \
			gsub(/##ARG$$/, "", desc); \
			gsub(/#([^#]*)$$/, "\\1", desc); \
			printf "$(COLOR_GREEN)%-30s$(COLOR_RESET) $(COLOR_BLUE)%s$(COLOR_RESET)\n", $$1, desc; \
		} else if ($$2 ~ /##ARG/) { \
			desc = $$2; \
			gsub(/.*##ARG /, "", desc); \
			gsub(/#([^#]*)$$/, "\\1", desc); \
			printf "$(COLOR_GREEN)%-30s$(COLOR_RESET) %s$(COLOR_BLUE)%s$(COLOR_RESET)\n", $$1, substr($$2, 1, length($$2) - length(desc) - 6), desc; \
		} else { \
			printf "$(COLOR_GREEN)%-30s$(COLOR_RESET) %s\n", $$1, $$2; \
		} \
	}'

# Extract arguments of the subcommand
.PHONY: _run_args
_run_args:
	# use the rest as arguments for the subcommand
	RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
	# ...and turn them into do-nothing targets
	$(eval $(RUN_ARGS):;@:)