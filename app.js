let http = require("http");
let url = require("url");
let port=1111;
let fs = require('fs') 
let  empInfo = new  Array();
let htmlContent = `
<html>
    <head>
    </head>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet"
integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">

    <body>
    <form action="/store" method="get"  >
    <div class="card"> 
    <div class="card-body">
        <h2 class="card-title">Task Planner</h2>
        <br />
        <p class="card-subtitle"  >
            
            Employee ID : <input type = "text" id="task" name="eid"  > &nbsp; <br /><br />
            Task ID :    &nbsp; &nbsp; &nbsp;  &nbsp; <input type = "text" id="task" name="tid"  > &nbsp; <br /><br />
            Task :  &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp;<input type = "text" id="task" name="task" placeholder="Add Your Task" > &nbsp; <br /><br />
            Deadline : &nbsp;  &nbsp; <input type = "datetime-local" id="task" name="deadline" placeholder="Deadline" > &nbsp; <br /><br />
             
            <button type="submit" value="submit"  >Add Task</button> 
         

        </p>
            </div>       
         </div>
 </form>
    </body>
</html>
` ;


let successs = `
<html>
    <head>
    </head>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet"
integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">

<body>
<div class="alert alert-primary" role="alert">
    Task Stored !
</div>
</body>
</html>
` ;



let displayHtml = `
<html>
    <head>
    </head>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet"
integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">

<body>


<table  class="table table-bordered" >
<tr>
<th scope="col">Task Id </th>
<th scope="col">Emp Id </th>
<th scope="col">Task</th>
<th scope="col">Deadline</th>


</tr>


` ;


let deleteInfo=`
<html>
    <head>
    </head>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet"
integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">

    <body>
    <form action="/delete" method="get"  >
    <div class="card"> 
    <div class="card-body">
        <h2 class="card-title">Task Planner</h2>
        <br />
        <p class="card-subtitle"  >
            
            Task ID : <input type = "text" id="tid" name="tid" placeholder="Task ID"  > &nbsp;
             
            <button type="submit" value="submit"  >Delete Task</button> 
        
        </p>
            </div>       
         </div>
 </form>
    </body>
</html>
` ;




let server = http.createServer((req,res) => {
   
    var pathInfo = url.parse(req.url,true).pathname;

 
     // This is Page with task form !
    if(req.url =="/") {
 
        res.setHeader("content-type" , "text/html") ;
        res.write(htmlContent) ;
    }


    // This is when task gets stored 
    else if(pathInfo =="/store") {

        var data = url.parse(req.url,true).query;
        res.setHeader("content-type" , "text/html") ;
    
        res.write(htmlContent) ;
        // res.write(data.eid + "" +data.tid + "" + data.task + "" +data.deadline) ;
        

        var emptask = {} ;
        emptask.eid = data.eid ;
        emptask.tid = data.tid;
        emptask.task = data.task ;
        emptask.deadline = data.deadline ;
        fs.readFile("emp.json" ,  (err,data) => {
            if(!err) {
                
              var newA = JSON.parse(data) ;
              newA.push(emptask);
         
        fs.writeFile("emp.json" , JSON.stringify(newA) ,  (err) => {
            if(!err) {
                console.log("Record Stored") ;
                 }
             });
            }
        });

       res.write(successs) ;
    }





    else if(pathInfo == "/display") {
        res.setHeader("content-type" , "text/html") ;
    
       
        res.write(`<hr />`)
        fs.readFile("emp.json",(err,data)=> {
       
         
            let empString = data.toString()
            let empJson = JSON.parse(empString);
         
            for(p of empJson) {
          
            displayHtml += 
            
            `
            <tr>
            <td scope="row">${p.tid}</td>
            <td>${p.eid} </td>
            <td>${p.task} </td>
            <td>${p.deadline} </td>
           
            </tr>
            `
   }

           displayHtml+= `</table>
           </body>
            </html>
           
           `
       
        });
       
       
       
        res.write(`<p>Want to Add Another Task  ? `);
        res.write(htmlContent) ;
        res.write(`<hr />`)
        res.write(`<p>Pending Task in System   `);
        res.write(displayHtml) ;
       
        res.write(`<hr />`)
        res.write(`<p>Want to Delete Task  ? `);
        res.write(deleteInfo) ;

    }




    else if(pathInfo == "/delete") {

        let urlDetails = req.url;
        let data = url.parse(urlDetails, true).query;
        
        let tasks= fs.readFileSync("emp.json").toString();
        let items = new Array();
        if (tasks != "") {
            items = JSON.parse(tasks);
        }


       res.write("Clear till here ") ;


         let flag = false;
        for (let i = 0; i < items.length; i++) {
            if (items[i].tid == data.tid) {
                items.splice(i, 1);
                flag = true;
            }
        }
        if (!flag) {
            res.write("Task ID not found");
        } else {
            res.write("Task Deleted Successfully");
        }


        newTask = JSON.stringify(items) ;
        fs.writeFileSync("emp.json", newTask);
    }
res.end();
});

server.listen(port,()=>console.log(`Server is running on port number ${port}`));




