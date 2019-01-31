const integrate = (f,a,b,res = .001) => {
  let output = 0;
  for(let i1=a; i1<b; i1+=res){
    output += f(i1) * res;
  }
  return output;
}
