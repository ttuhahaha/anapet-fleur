//return true/false if x%2==0
x => x % 2 == 0

//
//if a > b return a, else b
a > b ? a : b

//
//array of coordinates
let arr = [{x:1,y:2}, {x:2,y:2}]

//
//create an array of 100 new particles 
//https://www.youtube.com/watch?v=m9bRVQ_-DXY
let particles;
particles = Array (100).fill().map(p => new Particle());

//
//remove dead particles
particles = particles.filter (p => !p.Dead());

//
//vector can add coordinates directly
v.add(p.x,p.y);

//
//sort particles based on color (lighter to the front)
particles.sort ((a,b) => a.col - b.col)

//
// for each loop
particles.forEach (p => p.update())

//
blendMode(LIGHTEST)

// spread syntax to add all elements of the array/object
function sum(x, y, z) {return x + y + z}
const numbers = [1, 2, 3];
console.log(sum(...numbers)); // expected output: 6

// ? operator if else
function example(…) {
    return condition1 ? value1
         : condition2 ? value2
         : condition3 ? value3
         : value4;
}