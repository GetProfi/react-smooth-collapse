# react-smooth-collapse

[![Circle CI](https://circleci.com/gh/StreakYC/react-smooth-collapse.svg?style=shield)](https://circleci.com/gh/StreakYC/react-smooth-collapse)
[![npm version](https://badge.fury.io/js/react-smooth-collapse.svg)](https://badge.fury.io/js/react-smooth-collapse)

This component lets you animate the height of an element to reveal or hide its
contents. The animation automatically adjusts to the natural height of the
contents.

![Example](https://streakyc.github.io/react-smooth-collapse/video/showhide.gif)

An example can be tried here:

https://streakyc.github.io/react-smooth-collapse/example/

You can find its code in the `example` directory. The example may be compiled
by running:

```
npm install
npm run example-build
```

You can build the example with live editing enabled (using
[react-transform-hmr](https://github.com/gaearon/react-transform-hmr) and
[browserify-hmr](https://github.com/AgentME/browserify-hmr)) by running:

```
npm run example-watch
```

**Q:** Why would I use this when I could set a transition rule for height on an
element, and then change the height from "auto" to "0"?

**A:** You can't animate from "auto". This component has the height set to
"auto" while the element is expanded, and when the element is set to collapse,
the element's height is set to equal its current height, and then set to "0" so
that it animates shrinking correctly.

**Q:** Couldn't I animate shrinking by setting a transition rule for
max-height, setting max-height to a very large value when the element is
expanded, and then set max-height to "0" when the element is collapsed?

**A:** That won't animate with the given duration and won't fully respect your
timing function. For example, if you have an element that currently has a
height of 100px, a max-height of 10000px, and a transition rule of "max-height
1s linear", then it will take 0.99 seconds before the element appears to start
shrinking, and then it will fully shrink in 0.01 seconds. If you use a timing
function like "ease" instead of "linear", then the easing will only be apparent
while the element finishes shrinking to 0 or begins expanding from 0.

## SmoothCollapse

This module exports the `SmoothCollapse` React component. The children of the
component should be the contents you want to show or hide. The component also
takes the following props:

* `expanded` must be a boolean controlling whether to show the children.
* `onChangeEnd` may be a function which will be called whenever a show or hide
 animation is completed.
* `collapsedHeight` is the CSS height that the contents should have when
 collapsed. Defaults to "0".
* `heightTransition` may be a string and is used for customizing the animation.
 This value is prefixed with "height " and is set as the CSS transition
 property of the SmoothCollapse element. This property defaults to ".25s ease".

If the SmoothCollapse component starts out with expanded set to false and
collapsedHeight is 0, then the children are not rendered until the first time
the component is expanded. After the component has been expanded once, the
children stay rendered so that they don't lose their state when they're hidden.

## Types

[Flow](http://flowtype.org/) type declarations for this module are included! As
of Flow v0.22, you must add the following entries to your `.flowconfig` file's
options section for them to work:

```
[options]
esproposal.class_static_fields=enable
esproposal.class_instance_fields=enable
```
