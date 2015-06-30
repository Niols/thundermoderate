
thundermoderate.xpi:
	rm -f thundermoderate.xpi
	zip -r thundermoderate.xpi chrome install.rdf chrome.manifest	

clean:
	rm -f thundermoderate.xpi
	find -iregex '.*~' -exec rm '{}' \;
