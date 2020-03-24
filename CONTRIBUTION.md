# Contribution rules

## 1 - Use branches

The branch name starts with the application scope, followed by a /, then the function you are working on:

*front/registration*


## 2 - Commits

Type of commit, application scope, commit message:

*feat(front): add connexion forms*

Allowed types are:
* feat -> feature
* fix -> fix
* doc -> documentation
* struct -> refacto

Commits messages must start with a verb.
Application scope can be omitted if it applies to the whole project

## 3 - Merges

If you want to merge your branch to a higher level one, please use the pull request function.
Don't merge your branch to master before a reviewer accepted the PR.

The branch hierarchy is:
* master
* develop
* scope/base
* scope/function

Replace scope with your application scope.

