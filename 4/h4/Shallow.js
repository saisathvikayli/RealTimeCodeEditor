 const user = {
                id: 101,
                name: "Ravi",
                preferences: {
                  theme: "dark",
                  language: "en"
                }
              };
 
let copyUser={...user}
user.name="Lokesh"
user.preferences.theme="Light"
console.log(user)
console.log(copyUser)
//in shallow copy nested objects can not change if changes both are changed