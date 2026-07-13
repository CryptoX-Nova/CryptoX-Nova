// =====================================
// CryptoX Nova Login JS
// =====================================


const form = document.getElementById("loginForm");



form.addEventListener("submit", async (e) => {


    e.preventDefault();



    const username =
    document.getElementById("username").value;



    const password =
    document.getElementById("password").value;





    try{


        const response = await fetch("/api/auth/login", {


            method:"POST",


            headers:{


                "Content-Type":"application/json"


            },


            body:JSON.stringify({


                username,

                password


            })


        });






        const data = await response.json();



        console.log("LOGIN RESPONSE:", data);






        if(data.success){



            alert(data.message);





            // CHECK ADMIN ROLE


            if(data.user && data.user.role === "admin"){


                console.log("Admin detected");


                window.location.href="/admin.html";



            }else{



                console.log("Normal user detected");


                window.location.href="/dashboard.html";



            }





        }else{


            alert(data.message);



        }





    }catch(error){



        console.error("Login Error:", error);



        alert("Server connection error");



    }



});