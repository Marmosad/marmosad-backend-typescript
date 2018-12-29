# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a 
   build
2. Document your changes
3. Contact one of the developers after submitting a merge request

## Style Guide

* Classes are in UpperCamelCase
* Functions are in lowerCamelCase
* Interfaces are UpperCamelCase
* Try to leave two spaces between code blocks
* Make Interfaces for Objects where applicable
* Objects are treated as some representation of parts of game view
    * Avoid direct, especially two-way communication between objects
* Services are treated as providers of objects, api, utility, etc
    * As a side note, all external communication should be handled through a service
* Handlers are used to handle event emitter/observables to preserve single way data flow 
    * Event registered by object at emitter end
    * Event captured by handler at observer end
    * Event handled by object's parent
    * Object parent manipulates view objects

