# Project: Task Management System
## Description:
The project is a task management system designed to help individuals or teams organize and track their tasks and projects. It utilizes a database to store two collections: "Tasks" and "Users". The "Tasks" collection will store documents representing individual tasks, while the "Users" collection will store information about system users.

## Collections:
* Tasks Collection:
```
{
    "_id": "",
    "title": "",
    "description": "",
    "status": "",
    "priority": "",
    "deadline": "",
    "assignedTo": "",
    "additionalFields": {
      "estimatedHours": #,
      "tags": ["", ""]
    }
```
* Users Collection:
``` 
{
    "name": "",
    "email": "",
    "password": "",
    "role": "",
    "department": "",
    "joinDate": "",
    "additionalFields": {
      "contactNumber": "",
      "profilePicture": ""
    }
  }
  ```
  
 By implementing this task management system, users can create, update, and track tasks, assign them to specific individuals or teams, set deadlines, and monitor progress. The database will provide persistent storage for task and user data, allowing seamless retrieval and management of information.
