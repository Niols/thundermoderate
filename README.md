ThunderModerate
===============

ThunderModerate is a thunderbird extension intended to ease moderation tasks at the ENS by adding a little toolbar on e-mails allowing to see and change the status of a mail using the webmodo API.

Installation
------------

- Obtain the .xpi file for ThunderModerate (see the two sections below)
- Install it ([Add-ons and Extensions FAQ :: How do I install an add-on?](https://support.mozilla.org/en-US/kb/add-ons-and-extensions-faq#w_how-do-i-install-an-add-on))

Download the .xpi
-----------------

You can directly download the .xpi file from [the releases page](https://github.com/Niols/thundermoderate/releases).

Note that if you're using firefox, it will try to install it. You will have to force the download (right click > save link as). 

Build the .xpi
--------------

You can also build the .xpi file by yourself.

Clone (or download) the repository and run the make command in it. You must have the `zip` command available on your computer.

    git clone https://github.com/Niols/thundermoderate
    cd thundermoderate
    make

You should get a thundermoderate.xpi file. 
