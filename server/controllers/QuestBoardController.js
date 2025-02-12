const db = require('../models/QuestBoardModels');

const questBoardController = {}

questBoardController.getTasks = async (req,res,next) => {
  //receives the project ID of which we want to retrieve the list of tasks 
    const {projectsId} = req.body
    try {
      const params = [projectsId] 

      //SQL query to retrieve the complete task list for a given project ID
      const projectQuery = `
      SELECT 
          tasks.tasks_id, 
          tasks.name, 
          tasks.desc, 
          ARRAY_AGG(accounts.username) AS "assignedUsers"
      FROM 
          tasks
      LEFT JOIN 
          task_assignments ON tasks.tasks_id = task_assignments.task_id
      LEFT JOIN 
          accounts ON task_assignments.user_id = accounts.user_id
      WHERE 
          tasks.projects_id = $1
      GROUP BY 
          tasks.tasks_id
      ORDER BY 
          tasks.tasks_id;
  `;
      const result = await db.query(projectQuery, params)
      console.log(result.rows)
      res.locals.taskList =  result.rows
      return next()
    } catch (err) {
      return next({
        log: `userController.getProjects: ERROR: ${err}`,
        message: { err: 'Error occured in userController.getProjects.' },
        status: 500,
      });
    }
  }

  questBoardController.newTask = async (req,res,next) => {
    //receiving the project ID where we want to add a new task, desc and name for task information 
    const {projectsId, desc, name} = req.body
    console.log(req.body)
    try {
      const params = [projectsId, desc, name] 
      //SQL query to insert the new task desc/name with project id
      const projectQuery = `INSERT INTO tasks (projects_id, "desc", name) VALUES ($1, $2, $3)`  
      const result = await db.query(projectQuery, params)
      res.locals.newTask = result.rows[0]
      return next()
    } catch (err) {
      return next({
        log: `userController.newTask: ERROR: ${err}`,
        message: { err: 'Error occured in userController.newTask.' },
        status: 500,
      });
    }
  }

  questBoardController.deleteTask = async (req,res,next) => {
    //receiving the task ID where we want to delete a task
    const {tasksId} = req.body
    console.log(req.body)
    try {
      const params = [tasksId] 
      //SQL query to delete the task at given task ID
      const projectQuery = `DELETE FROM tasks WHERE tasks_id = $1`;
      const result = await db.query(projectQuery, params)
      res.locals.deleteTask = result.rows[0]
      return next()
    } catch (err) {
      return next({
        log: `userController.deleteTask: ERROR: ${err}`,
        message: { err: 'Error occured in userController.deleteTask.' },
        status: 500,
      });
    }
  }

  questBoardController.updateTask = async (req,res,next) => {
    //receiving the task ID where we want to update a task desc/name
    const { tasksId, desc, name } = req.body;
    console.log("body", req.body)
    
    try {
      const params = [desc, name, tasksId];
      //SQL query to update a task desc/name given taskID
      console.log('params', params)
      const projectQuery = `UPDATE tasks SET "desc" = $1, name = $2 WHERE tasks_id = $3`;
      const result = await db.query(projectQuery, params)
      console.log('result', result)
      return next()
    } catch (err) {
      return next({
        log: `userController.updateTask: ERROR: ${err}`,
        message: { err: 'Error occured in userController.updateTask.' },
        status: 500,
      });
    }
  }

  questBoardController.assignUser = async (req, res, next) => {
    //receiving the task ID and userID where we want to assign a user a task 
    const {tasksId, userId} = req.body;
    console.log("in assignUser middleware... tasksId: ", tasksId, "userId: ", userId  )
    try {
      const params = [tasksId, userId];
      //SQL query to assign a task to a user given task and user ID
      const projectQuery = 'INSERT INTO task_assignments (task_id, user_id) VALUES ($1, $2);'
      const result = await db.query(projectQuery, params)
      return next()
    } catch (err) {
      return next({
        log: `userController.assignUser: ERROR: ${err}`,
        message: { err: 'Error occured in userController.assignUser.' },
        status: 500,
      });
    }
  }

  module.exports = questBoardController