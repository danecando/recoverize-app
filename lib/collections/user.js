ProfileSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    regEx: /^[a-zA-Z\s]*$/,
    min: 3,
    max: 30,
    optional: true
  },
  soberDate: {
    type: Date,
    label: "Sober Date",
    optional: true
  },
  gender: {
    type: String,
    label: "Gender",
    allowedValues: ["male", "female"],
    optional: true
  },
  program: {
    type: String,
    label: "Program",
    allowedValues: ["aa", "na", "ca", "cma", "coda", "oa", "ga", "ha", "ma", "sa", "alanon", "naranon", "gamanon"],
    optional: true
  },
  homegroup: {
    type: String,
    label: "Home Group",
    min: 2,
    max: 30,
    optional: true
  },
  quote: {
    type: String,
    label: "User Quote",
    optional: true,
    max: 180
  },
  location: {
    type: String,
    label: "Location",
    max: 60,
    optional: true
  },
  profilePic: {
    type: String,
    label: "Profile Picture",
    optional: true
  },
  profilePicThumb: {
    type: String,
    label: "Profile Pic Thumbnail",
    optional: true
  }
});

UserSchema = new SimpleSchema({
  username: {
    type: String,
    regEx: /^[a-zA-Z0-9]+$/,
    min: 3,
    max: 20,
    optional: true
  },
  emails: {
    type: [Object],
    optional: true
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  lastActive: {
    type: Date,
    optional: true
  },
  profile: {
    type: ProfileSchema,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: Object,
    optional: true,
    blackbox: true
  },
  followers: {
    type: [String],
    defaultValue: []
  },
  follows: {
    type: [String],
    defaultValue: []
  },
  followersCount: {
    type: Number,
    defaultValue: 0
  },
  followsCount: {
    type: Number,
    defaultValue: 0
  },
  serenity: {
    type: Number,
    defaultValue: 0
  },
  status: {
    type: Number,
    defaultValue: 0
  },
  profileCreated: {
    type: Boolean,
    defaultValue: false,
    optional: true
  }
});

UserSchema.messages({
  'regEx profile.name': [
    { msg: 'Display names can only contain letters'}
  ],
  'regEx username': [
    { msg: 'Username can only contain letters & numbers' }
  ]
});

Meteor.users.attachSchema(UserSchema);
