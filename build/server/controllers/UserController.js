const db=require("../models/QuestBoardModels"),bcrypt=require("bcrypt"),userController={addProject:async(r,s,e)=>{let o=r.body.projectsId;if(!o){const s=[r.body.projectName],e="INSERT INTO projects (project_name) VALUES ($1) RETURNING *;";o=(await db.query(e,s)).rows[0].projects_id}try{const t=[o],c="SELECT * FROM projects WHERE projects_id = $1";return 0===(await db.query(c,t)).rows.length?s.status(404).send({error:"Project not found."}):(r.body.projectsId=o,e())}catch(r){return e({log:`userController.addProject: ERROR: ${r}`,message:{err:"Error occurred in userController.addProject."},status:500})}},register:async(r,s,e)=>{const{username:o,password:t,projectsId:c}=r.body,d=await bcrypt.hash(t,10);try{const t=r.body.projectsId?[o,d,c]:[o,d],u=r.body.projectsId?"INSERT INTO accounts (username, password, projects_id) VALUES ($1, $2, $3) RETURNING *":"INSERT INTO accounts (username, password) VALUES ($1, $2) RETURNING *",n=await db.query(u,t);return s.locals={userId:n.rows[0].user_id,projectsId:n.rows[0].projects_id},e()}catch(r){return e({log:`userController.register: ERROR: ${r}`,message:{err:"Error occured in userController.register."},status:500})}},login:async(r,s,e)=>{const{username:o,password:t}=r.body;try{const c=[o],d="SELECT * FROM accounts WHERE username = $1",u=await db.query(d,c);if(u.rows.length>0&&await bcrypt.compare(t,u.rows[0].password))return r.session.user={userId:u.rows[0].user_id,projectsId:u.rows[0].projects_id,loginStatus:!0},s.locals={userId:u.rows[0].user_id,projectsId:u.rows[0].projects_id},e()}catch(r){return e({log:`userController.login: ERROR: ${r}`,message:{err:"Error occured in userController.login."},status:500})}},checkSession:(r,s,e)=>r.session.user?(s.locals={userId:r.session.user.userId,projectsId:r.session.user.projectsId,loginStatus:!0},e()):(s.locals={userId:null,projectsId:null,loginStatus:!1},e()),logout:(r,s,e)=>{r.session.destroy(),e()}};module.exports=userController;