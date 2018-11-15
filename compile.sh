JSINPUTLOCATION="scripts/main.js"
JSOUTPUTLOCATION="public/javascripts/bundle.min.js"

function testerror {
	if [ $1 -ne 0 ]
	then
		echo $2
		exit $1
	fi
}

function broserifying {
	echo "broserifying"
	browserify $JSINPUTLOCATION -o $JSOUTPUTLOCATION
	testerror $? "Error At Browserify"
}

function uglifying {
	echo "ulgifying"
	uglifyjs -m -o $JSOUTPUTLOCATION $JSOUTPUTLOCATION
	testerror $? "Error At UglifyJS"
}

function compiling {
	echo "compiling"
	tsc sources/main.ts
	testerror $? "Error At TypeScript"
	JSINPUTLOCATION=sources/main.js
}

function main {
	# compiling
	broserifying
	uglifying
	echo "done"
}

main
