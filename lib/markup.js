var EventEmitter = require('events').EventEmitter;
var templates = require('derby-templates');
var createPathExpression = require('derby-expressions/create');

// TODO: Should be its own module

var markup = module.exports = new MarkupParser();

function MarkupParser() {
  EventEmitter.call(this);
}
mergeInto(MarkupParser.prototype, EventEmitter.prototype);

markup.on('element:a', function(template) {
  // console.log(template)
});

markup.on('element:input', function(template) {
  // console.log(template)
});

markup.on('element:form', function(template) {
  if (hasListenerFor(template, 'submit')) {
    addListener(template, 'submit', '$preventDefault()')
  }
});

function hasListenerFor(template, eventName) {
  var hooks = template.hooks;
  if (!hooks) return false;
  for (var i = 0, len = hooks.length; i < len; i++) {
    var hook = hooks[i];
    if (hook instanceof templates.ElementOn && hook.name === eventName) {
      return true;
    }
  }
  return false;
}

function addListener(template, eventName, source) {
  var hooks = template.hooks || (template.hooks = []);
  var expression = createPathExpression(source);
  hooks.push(new templates.ElementOn(eventName, expression));
}

function mergeInto(to, from) {
  for (var key in from) {
    to[key] = from[key];
  }
  return to;
}