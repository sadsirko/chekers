'use strickt'
let spec_arr=[];
let n = 1;
  for(let i = 0 ; i < 7; i++){
    spec_arr[i] = [];
   for (let j = 0; j < 8; j++) {
    spec_arr[i][j] = 0 ; 
    }
  }

  for(let j = 0 ; j < 4 ; j++)
  {
    for (let i = 0; i < 4; i++) {
      spec_arr[0 + i +j ][4 + i - j] = n ;
     spec_arr[0 + i +j ][3 + i - j] = (n + 4) ;
      n++;
       } n += 4;
} 

console.log(spec_arr);