const baseElements = [
  "Conditional", "Method", "Variable", "Object", "Loop", "Class"
];

const recipes = {
  "Constructor": ["Class", "Method"],
  "Counter": ["Variable", "Loop"],
  "Parameter": ["Method", "Variable"],
  "Override": ["Method", "Method"],
  "Call": ["Object", "Method"],
  "Subclass": ["Class", "Class"],
  "While Loop": ["Loop", "Conditional"],
  "Instance Variable": ["Class", "Variable"],
  "Boolean": ["Conditional", "Variable"],
  "Accessing": ["Object", "Variable"],
  "Inheritance": ["Object", "Class"],

  // Tier 2
  "For Loop": ["While Loop", "Counter"],
  "Polymorphism": ["Class", "Subclass"],
  "Instance": ["Constructor", "Object"],
  "Return": ["Call", "Variable"],
  "Signature": ["Method", "Parameter"],
  "Overloading": ["Signature", "Constructor"],
  "If Statement": ["Call", "Boolean"],

  // Tier 3
  "Scope": ["Variable", "Method"],
  "This Keyword": ["Instance", "Variable"],
  "Default Constructor": ["Constructor", "Subclass"],
  "Abstract Class": ["Polymorphism", "Inheritance"],
  "Nested Loop": ["For Loop", "For Loop"],
  "Static Variable": ["Variable", "Class"],
  "Getter/Setter": ["Method", "Accessing"]
};
