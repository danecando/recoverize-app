/**
 * https://kadira.io/
 * Performance Monitoring for Meteor
 */

Meteor.startup(function() {
  if (process.env.NODE_ENV === 'production') {
    Kadira.connect('tnP8Xo4gvsMBsjwrq', 'fbdf083e-d868-4550-a79e-935ec6227ebe');
  }
});
