.PHONY: build

build:
	@mkdir -p .github/instructions
	@cp -R v0/instructions/* .github/instructions/
	@cp -R v0/.editorconfig .editorconfig
	@cp -R v0/tsconfig.json tsconfig.json
	@cp -R v0/.gitignore.txt .gitignore
	@bun i @types/bun -D
	@bun run v0/init
