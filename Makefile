
SRC = ./stylus/index.styl
DEST = ./static/

watch:
	@./node_modules/.bin/stylus \
		--watch \
		--use ./node_modules/nib/ \
		--out ${DEST} \
		${SRC}

.PHONY: watch
