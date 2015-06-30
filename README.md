ThunderModerate
===============

**ThunderModerate** is a thunderbird extension intended to ease moderation
tasks at the ENS.

This version is inspired by the one that `pintoch` wrote in 2013, but has been
almost fully rewritten.


Installation
------------

1. Make sure you have the `zip` command available.
2. Then simply do: `make`.
3. This will create a `thundermoderate.xpi` file allowing you to install
the extension:
  1. In the menu, go to “Add-ons”.
  2. Press the “Tools” button and choose “Install Add-on from file...”
  3. Find the `thundermoderate.xpi` file.
  4. Install the extension and restart thunderbird.
4. You can then clean everything with `make clean`.


TODO
----

- [x] Display moderate buttons on messages to moderate.
- [x] Show the actual status of the mail (by asking to webmodo).
- [x] Allow moderation with these buttons.
- [x] Add preference window for token managment.
- [ ] Handle conflict with CSRF authentication when connected.
- [x] Handle properties text in js scripts.
- [ ] Replace mod buttongs by 'cancel' button that does what it's supposed to do.
- [x] English support
