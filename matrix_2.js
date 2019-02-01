const isTypedArray = a => !!(a.buffer instanceof ArrayBuffer && a.BYTES_PER_ELEMENT);
const isNestedArray = a => {
  if(Array.isArray(a)){
    if(Array.isArray(a[0])){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}
const is2dNestedArray = a => {
  if(isNestedArray(a)){
    if(Array.isArray(a[0][0])){
      return false;
    }else{
      return true;
    }
  }else{
    return false;
  }
}
const isNumerical2dNestedArray = a => {
  if(is2dNestedArray(a)){
    let check = true;
    if(a[0].length == 0) return false;
    for(let i=0;i<a.length;i++){
      for(let j=0;j<a[i].length;j++){
        if(typeof a[i][j] != "number") check = false;
      }
    }
    return check;
  }else{
    return false;
  }
}
const noNullSpotsNum2dNestArr = a => {
  if(isNumerical2dNestedArray(a)){
    let check = true;
    for(let i=0;i<a.length;i++){
      for(let j=0;j<a.length;j++){
        if(a[i].length != a[j].length) check = false;
      }
    }
    return check;
  }else{
    return false;
  }
}
const isNumericArray = a => {
  let check = true;
  if(a.length==0) return false;
  for(let i=0;i<a.length;i++){
    if(typeof a[i] != "number") check = false;
  }
  return check;
}
class Matrix{
  constructor(data,shape,shape2){
    if(data !== undefined){
      if(Array.isArray(data)){
        if(isNestedArray(data)){
          if(is2dNestedArray(data)){
            if(isNumerical2dNestedArray(data)){
              if(noNullSpotsNum2dNestArr(data)){
                let newData = [];
                this.shape = [data.length,data[0].length];
                for(let i=0;i<this.shape[0];i++){
                  newData.push([]);
                  for(let j=0;j<this.shape[1];j++){
                    newData[i].push(data[i][j]);
                  }
                }
                this.data = newData;
                this.length = this.shape[0] * this.shape[1];
                this.disposed = false;
              }else{
                console.error("One or more empty values for inferred shape in data array!");
                return false;
              }
            }else{
              console.error("One or more values are nonnumerical in data array!");
              return false;
            }
          }else{
            console.error("Recived three or more dimensions for data input; matrix only works with two-dimensional data!");
            return false;
          }
        }else{
          if(Array.isArray(shape)){
            if(!isNestedArray(shape)){
              if(shape.length == 2){
                if(isNumericArray(shape)){
                  if(shape[0] * shape[1] == data.length){
                    let outData = [];
                    let counter = 0;
                    for(let i=0;i<shape[0];i++){
                      outData.push([]);
                      for(let j=0;j<shape[1];j++){
                        outData[i].push(data[counter]);
                        counter++;
                      }
                    }
                    this.data = outData;
                    this.shape = shape;
                    this.length = this.shape[0] * this.shape[1];
                    this.disposed = false;
                  }else{
                    console.error("Shape mismatch between [shape] parameter, and entries in data!");
                    return false;
                  }
                }else{
                  console.error("Recived non-numeric shape array for [shape] parameter!  Shape must be numeric array!");
                  return false;
                }
              }else{
                console.error("Recieved non-two-dimensional shape array for [shape] parameter!  Shape must be two dimensions!");
                return false;
              }
            }else{
              console.error("Recieved nested array for [shape] parameter, correct order is (data,shape).");
              return false;
            }
          }else{
            if(shape2 !== undefined){
              if(typeof shape == "number"){
                if(typeof shape2 == "number"){
                  let outData = [];
                  let counter = 0;
                  for(let i=0;i<shape;i++){
                    outData.push([]);
                    for(let j=0;j<shape2;j++){
                      outData[i].push(data[counter]);
                      counter++;
                    }
                  }
                  this.data = outData;
                  this.shape = [shape,shape2];
                  this.length = this.shape[0] * this.shape[1];
                  this.disposed = false;
                }else{
                  console.error("Didn't recieve number as second shape parameter!  Shape parameters must be an array of two values, or two parameters of numbers!");
                  return false;
                }
              }else{
                console.error("Didn't recieve number as first shape parameter!  Shape parameters must be an array of two values, or two parameters of numbers!");
                return false;
              }
            }else{
              console.error("Didn't recieve second shape parameter!  If shape isn't specified as an array of two values, then a second shape paramter must be specified!");
              return false;
            }
          }
        }
      }else if(isTypedArray(data)){
        console.error("Unable to create matrix, specified data array is a typed array.  Typed arrays not currently implemented!");
        return false;
      }else if(data instanceof Matrix){
        return Matrix.duplicate(data);
      }else{
      console.error("Error when creating matrix, [data] parameter must be: a) plain array with specified shape in either an array or list of two numbers (rows and columns), b) a structured 'hole-less' numeric nested array, or c) another matrix.");
      return false;
      }
    }else{
      console.error("Error when creating matrix, [data] parameter must be: a) plain array with specified shape in either an array or list of two numbers (rows and columns), b) a structured 'hole-less' numeric nested array, or c) another matrix.");
      return false;
    }
  }
  // --- Matrix Management ---
  static duplicate(a){
    return new Matrix(a.data);
  }
  new(){ // Doesn't alter original
    return new Matrix(this.data);
  }
  flatten(){
    let newArr = [];
    let newShape = [1,this.shape[0]*this.shape[1]];
    for(let i=0;i<this.shape[0];i++){
      for(let j=0;j<this.shape[1];j++){
        newArr.push(this.data[i][j]);
      }
    }
    return new Matrix(newArr,newShape);
  }
  static dispose(...mats){
    mats.forEach(c => {
      if(c instanceof Matrix){
        c.data = null;
        c.shape = null;
        c.disposed = true;
      }else{
        c = null;
      }
    });
  }
  dispose(){
    Matrix.dispose(this);
    return true;
  }
  static scalarOperate(a,fn){
    if(!a.disposed){
      for(let i=0;i<a.shape[0];i++){
        for(let j=0;j<a.shape[1];j++){
          let op = fn(a.data[i][j]);
          if(typeof op == "number" && Number.isFinite(op) && !isNaN(op)){
            a.data[i][j] = op;
          }else{
            throw `Cannot operate on this value: ${a.data[i][j]}; returns: ${op}; function: ${fn.toString()}`;
          }
        }
      }
    }else{
      throw `Matrix has been disposed! Cannot apply function: ${fn.toString()}`;
    }
  }
  static matrixOperate(a,b,fn){
    if(!a.disposed && !b.disposed){
      for(let i=0;i<a.shape[0];i++){
        for(let j=0;j<a.shape[1];j++){
          let op = fn(a.data[i][j],b.data[i][j]);
          if(typeof op == "number" && Number.isFinite(op) && !isNaN(op)){
            a.data[i][j] = fn(a.data[i][j],b.data[i][j]);
          }else{
            throw `Cannot operate on these values: ${a.data[i][j]}, ${b.data[i][j]}; returns: ${op}; function: ${fn.toString()}`;
          }
        }
      }
    }else{
      if(a.disposed && !b.disposed) throw `The first matrix has been disposed! Cannot apply function: ${fn.toString()}`;
      else if(!a.disposed && b.disposed) throw `The second matricix has been disposed!  Cannot apply function: ${fn.toString()}`;
      else if(a.disposed && b.disposed) `Both matricies have been disposed!  Cannot apply function: ${fn.toString()}`;
    }
  }
  static reduce(a,init,fn){
    if(!a.disposed){
      let acc = init;
      for(let i=0;i<a.shape[0];i++){
        for(let j=0;j<a.shape[1];j++){
          let op = fn(acc,a.data[i][j]);
          if(typeof op == "number" && Number.isFinite(op) && !isNaN(op)){
            acc = op;
          }else{
            throw `Cannot reduce on this value: ${a.data[i][j]}; returns: ${op}; function: ${fn.toString()}`;
          }
        }
      }
      return acc;
    }else{
      throw `Matrix has been disposed! Cannot apply reduction: ${fn.toString()}`;
    }
  }
  toRowArray(){
    let arr = [];
    for(let i=0;i<this.shape[0];i++){
      arr.push(this.getRow(i));
    }
    return arr;
  }
  toColArray(){
    let arr = [];
    for(let j=0;j<this.shape[1];j++){
      arr.push(this.getCol(j));
    }
    return arr;
  }
  // --- Create ---
  static random(shape,integer=false,min=0,max=1){
    let outArr = [];
    for(let i=0;i<shape[0];i++){
      outArr.push([]);
      for(let j=0;j<shape[1];j++){
        if(!integer) outArr[i].push(Math.random()*max+min);
        else outArr[i].push(Math.floor(Math.random()*max+min));
      }
    }
    return new Matrix(outArr);
  }
  static fixed(shape,value = 0){
    let outArr = [];
    for(let i=0;i<shape[0];i++){
      outArr.push([]);
      for(let j=0;j<shape[1];j++){
        outArr[i].push(value);
      }
    }
    return new Matrix(outArr);
  }
  static equalWeights(shape){
    let outArr = [];
    let weight = 1/(shape[0]*shape[1]);
    for(let i=0;i<shape[0];i++){
      outArr.push([]);
      for(let j=0;j<shape[1];j++){
        outArr[i].push(weight);
      }
    }
    return new Matrix(outArr);
  }
  // --- Display ---
  print(verbose = true){
    let str = `Matrix Parameters:\n`;
    if(verbose) str += `----Shape: [${this.shape[0]},${this.shape[1]}]\n`;
    if(verbose) str += `---Length: ${this.length}\n`;
    if(verbose) str += `-Disposed: ${this.disposed}\n`;
    str += `Data:`;
    for(let i=0;i<this.shape[0];i++){
      str += `\n`;
      for(let j=0;j<this.shape[1];j++){
        str += `${this.data[i][j]} `;
      }
    }
    console.log(str);
    return true;
  }
  // --- Data ---
  get(i,j){
    return this.data[i][j];
  }
  set(i,j,v){
    this.data[i,j] = v;
    return this;
  }
  getRow(r){
    if(r < this.shape[0]){
      return new Matrix(this.data[r],[1,this.data[r].length]);
    }else{
      console.error(`Row ${r} does not exist in this matrix!`);
      return false;
    }
  }
  setRow(r,vec){
    if(!this.disposed){
      if(vec.shape[1] == this.shape[1]){
        this.data[r] = vec.data[0];
        return this;
      }else{
        console.error(`Unable to set row, specified vector does not match in columns!  A Shape: [${this.shape[0]},${this.shape[1]}]; B Shape: [${vec.shape[0]},${vec.shape[1]}]`);
        return false;
      }
    }else{
      console.error("Matrix has been disposed!");
      return false;
    }
  }
  getCol(c){
    if(c < this.shape[1]){
      let newMat = this.new().transpose();
      return new Matrix(newMat.data[c],[newMat.data[c].length,1]);
    }else{
      console.error(`Column ${c} does not exist in this matrix!`);
      return false;
    }
  }
  setCol(c,vec){
    if(!this.disposed){
      if(vec.shape[0] == this.shape[0]){
        this.transpose();
        let newB = vec.new().transpose();
        this.data[c] = newB.data[0];
        this.transpose();
        return this;
      }else{
        console.error(`Unable to set column, specified vector does not match in rows!  A Shape: [${this.shape[0]},${this.shape[1]}]; B Shape: [${vec.shape[0]},${vec.shape[1]}]`);
        return false;
      }
    }else{
      console.error("Matrix has been disposed!");
      return false;
    }
  }
  push(b,rowCol = "col"){
    if(!this.disposed){
      if(b.shape[0] == 1){ // B is row vector
          if(b.shape[1] == this.shape[1]){
            this.shape[0]++;
            this.data.push(b.data[0]);
            return this;
          }else{
            console.error(`Unable to concatonate row vector; the number of columns must match!  A Shape: [${a.shape[0]},${a.shape[1]}]; B Shape: [${b.shape[0]},${b.shape[1]}]`);
            return false;
          }
      }else if(b.shape[1] == 1){ // B is col vector
        if(b.shape[0] == this.shape[0]){
          this.transpose();
          let tempB = b.new().transpose();
          this.shape[0]++;
          this.data.push(tempB.data[0]);
          this.transpose();
          Matrix.dispose(tempB);
          return this;
        }else{
          console.error(`Unable to concatonate column vector; the number of rows must match!  A Shape: [${a.shape[0]},${a.shape[1]}]; B Shape: [${b.shape[0]},${b.shape[1]}]`);
          return false;
        }
      }else{
        if(rowCol == "row"){
          if(b.shape[1] == this.shape[1]){
            this.shape[0] += b.shape[0];
            for(let i=0;i<b.shape[0];i++){
              this.data.push(b.data[i]);
            }
            return this;
          }else{
            console.error(`Unable to concatonate matricies row-wise, the number of columns don't match! A Shape: [${a.shape[0]},${a.shape[1]}]; B Shape: [${b.shape[0]},${b.shape[1]}]`);
            return false;
          }
        }else if(rowCol == "col"){
          if(b.shape[0] == this.shape[0]){
            this.transpose();
            let newB = b.new().transpose();
            for(let j=0;j<newB.shape[0];j++){
              this.data.push(newB.data[j]);
            }
            this.shape[0] += newB.shape[0];
            this.transpose();
            //Matrix.dispose(newB);
            return this;
          }else{
            console.error(`Unable to concatonate matricies column-wise, the number of rows don't match! A Shape: [${a.shape[0]},${a.shape[1]}]; B Shape: [${b.shape[0]},${b.shape[1]}]`);
            return false;
          }
        }else{
          console.error(`Could not understand second paramter: ${rowCol}`);
          return false;
        }
      }
    }else{
      console.error("This matrix has been disposed!");
      return false;
    }
  }
  pop(rowCol = "col",n = 1){
    if(!this.disposed){
      if(rowCol == "col"){
        if(n<this.shape[1]){
          this.transpose();
          for(let i=0;i<n;i++){
            this.data[this.data.length-1].pop();
          }
          this.shape[0]--;
          this.transpose();
        }else{
          console.error(`Unable to row-pop ${n} times, the shape of A is: [${a.shape[0]},${a.shape[1]}]`);
          return false;
        }
      }else if(rowCol == "row"){
        if(n<this.shape[0]-1){
          for(let i=0;i<n;i++){
            this.data[this.data.length-1].pop();
          }
          this.shape[0]--;
        }else{
          console.error(`Unable to column-pop ${n} times, the shape of A is: [${a.shape[0]},${a.shape[1]}]`);
          return false;
        }
        this.data[this.data.length-1].pop();
        this.shape[0]--;
        return this;
      }else{
        console.error(`First parameter not recognized: ${rowCol}`);
      }
    }else{
      console.error("Matrix has been disposed!");
      return false;
    }
  }
  // Lower bound: inclusive; Upper bound: non-inclusive;
  getSlice(row_low,col_low,row_high = this.shape[0],col_high = this.shape[1]){
    if(row_low < this.shape[0]){
      if(col_low < this.shape[0]){
        if(row_low < row_high){
          if(col_low < col_high){
            if(row_high <= this.shape[0]){
              if(col_high <= this.shape[1]){
                let newData = [];
                let newShape = [row_high-row_low,col_high-col_low];
                for(let i=row_low;i<row_high;i++){
                  for(let j=col_low;j<col_high;j++){
                    newData.push(this.data[i][j]);
                  }
                }
                return new Matrix(newData,newShape);
              }else{
                console.error(`Fourth parameter (col-upper-bound) must not be greater than number of columns!  Received: ${col_high}; Shape: [${this.shape[0]},${this.shape[1]}]`);
                return false;
              }
            }else{
              console.error(`Third parameter (row-upper-bound) must not be greater than number of columns!  Received: ${row_high}; Shape: [${this.shape[0]},${this.shape[1]}]`);
              return false;
            }
          }else{
            console.error(`Second parameter (col-lower-bound) must not be greater than upper bound!  Received: ${col_low}; Shape: [${this.shape[0]},${this.shape[1]}]`);
            return false;
          }
        }else{
          console.error(`First parameter (row-lower-bound) must not be greater than upper bound!  Received: ${row_low}; Shape: [${this.shape[0]},${this.shape[1]}]`);
          return false;
        }
      }else{
        console.error(`Column ${col_low} does not exist in this matrix!`);
        return false;
      }
    }else{
      console.error(`Row ${row_low} does not exist in this matrix!`);
      return false;
    }
  }
  setSlice(a,row_start=0,col_start=0,row_length=a.shape[0],col_length=a.shape[1]){
    if(!this.disposed){
      if(row_length < this.shape[0]){
        if(col_length < this.shape[1]){
          if(row_start + row_length < this.shape[0]){
            if(col_start + col_length < this.shape[1]){
              let iPrev = 0;
              let jPrev = 0;
              for(let i=row_start;i<row_length;i++){
                for(let j=col_start;j<col_length;j++){
                  this.data[i][j] = a.data[iPrev][jPrev];
                  jPrev++;
                }
                jPrev=0;
                iPrev++;
              }
              return this;
            }else{
              console.error(`Unable to set submatrix! Combined column index (${col_length}) is greater than the shape will allow!  A shape: [${this.shape[0]},${this.shape[1]}], B shape: [${a.shape[0]},${a.shape[1]}]`);
              return false;
            }
          }else{
            console.error(`Unable to set submatrix! Combined row index (${row_length}) is greater than the shape will allow!  A shape: [${this.shape[0]},${this.shape[1]}], B shape: [${a.shape[0]},${a.shape[1]}]`);
            return false;
          }
        }else{
          console.error(`Unable to set submatrix! ${col_length} is greater than the shape will allow!  A shape: [${this.shape[0]},${this.shape[1]}], B shape: [${a.shape[0]},${a.shape[1]}]`);
          return false;
        }
      }else{
        console.error(`Unable to set submatrix! ${row_length} is greater than the shape will allow!  A shape: [${this.shape[0]},${this.shape[1]}], B shape: [${a.shape[0]},${a.shape[1]}]`);
        return false;
      }
    }else{
      console.error(`This matrix has been disposed!`);
      return false;
    }
  }
  // --- Arithmetic ---
  add(a){
    if(typeof a == "number"){
      try{
        Matrix.scalarOperate(this,v => v+a);
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else if(a instanceof Matrix){
      if(a.shape[0] == this.shape[0] && a.shape[1] == this.shape[1]){
        try{
          Matrix.matrixOperate(this,a,(x,y) => x+y);
          return this;
        }
        catch(error){
          console.error(error);
          return false;
        }
      }else{
        console.error(`The shapes of the matricies don't match! The first is [${this.shape[0]},${this.shape[1]}], the second is [${a.shape[0]},${a.shape[1]}]`);
        return false;
      }
    }else{
      console.error(`To perform addition on this matrix, you need to specify a scalar value or another matrix of the same shape; recieved: ${typeof a}.`);
      return false;
    }
  }
  sub(a){
    if(typeof a == "number"){
      try{
        Matrix.scalarOperate(this,v => v-a);
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else if(a instanceof Matrix){
      if(a.shape[0] == this.shape[0] && a.shape[1] == this.shape[1]){
        try{
          Matrix.matrixOperate(this,a,(x,y) => x-y);
          return this;
        }
        catch(error){
          console.error(error);
          return false;
        }
      }else{
        console.error(`The shapes of the matricies don't match! The first is [${this.shape[0]},${this.shape[1]}], the second is [${a.shape[0]},${a.shape[1]}]`);
        return false;
      }
    }else{
      console.error(`To perform subtraction on this matrix, you need to specify a scalar value or another matrix of the same shape; recieved: ${typeof a}.`);
      return false;
    }
  }
  mul(a){
    if(typeof a == "number"){
      try{
        Matrix.scalarOperate(this,v => v*a);
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else if(a instanceof Matrix){
      if(a.shape[0] == this.shape[0] && a.shape[1] == this.shape[1]){
        try{
          Matrix.matrixOperate(this,a,(x,y) => x*y);
          return this;
        }
        catch(error){
          console.error(error);
          return false;
        }
      }else{
        console.error(`The shapes of the matricies don't match! The first is [${this.shape[0]},${this.shape[1]}], the second is [${a.shape[0]},${a.shape[1]}]`);
        return false;
      }
    }else{
      console.error(`To perform multiplication on this matrix, you need to specify a scalar value or another matrix of the same shape; recieved: ${typeof a}.`);
      return false;
    }
  }
  div(a){
    if(typeof a == "number"){
      try{
        Matrix.scalarOperate(this,v => v/a);
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else if(a instanceof Matrix){
      if(a.shape[0] == this.shape[0] && a.shape[1] == this.shape[1]){
        try{
          Matrix.matrixOperate(this,a,(x,y) => x/y);
          return this;
        }
        catch(error){
          console.error(error);
          return false;
        }
      }else{
        console.error(`The shapes of the matricies don't match! The first is [${this.shape[0]},${this.shape[1]}], the second is [${a.shape[0]},${a.shape[1]}]`);
        return false;
      }
    }else{
      console.error(`To perform division on this matrix, you need to specify a scalar value or another matrix of the same shape; recieved: ${typeof a}.`);
      return false;
    }
  }
  pow(a){
    if(typeof a == "number"){
      try{
        Matrix.scalarOperate(this,v => Math.pow(v,a));
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else if(a instanceof Matrix){
      if(a.shape[0] == this.shape[0] && a.shape[1] == this.shape[1]){
        try{
          Matrix.matrixOperate(this,a,(x,y) => Math.pow(x,y));
          return this;
        }
        catch(error){
          console.error(error);
          return false;
        }
      }else{
        console.error(`The shapes of the matricies don't match! The first is [${this.shape[0]},${this.shape[1]}], the second is [${a.shape[0]},${a.shape[1]}]`);
        return false;
      }
    }else{
      console.error(`To exponentiate on this matrix, you need to specify a scalar value or another matrix of the same shape; recieved: ${typeof a}.`);
      return false;
    }
  }
  sqrt(a){
    if(!this.disposed){
      this.pow(1/2);
      return this;
    }else{
      console.error("This matrix has been disposed!");
      return false;
    }
  }
  ln(){
    if(!this.disposed){
      try{
        Matrix.scalarOperate(this,v => Math.log(v));
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else{
      console.error(`This matrix has been diposed!`);
      return false;
    }
  }
  exp(){
    if(!this.disposed){
      try{
        Matrix.scalarOperate(this,v => Math.exp(v));
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else{
      console.error(`This matrix has been diposed!`);
      return false;
    }
  }
  // --- Trigonometry ---
  sin(){
    if(!this.disposed){
      try{
        Matrix.scalarOperate(this,v => Math.sin(v));
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else{
      console.error(`This matrix has been diposed!`);
      return false;
    }
  }
  cos(){
    if(!this.disposed){
      try{
        Matrix.scalarOperate(this,v => Math.cos(v));
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else{
      console.error(`This matrix has been diposed!`);
      return false;
    }
  }
  tan(){
    if(!this.disposed){
      try{
        Matrix.scalarOperate(this,v => Math.tan(v));
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else{
      console.error(`This matrix has been diposed!`);
      return false;
    }
  }
  asin(){
    if(!this.disposed){
      try{
        Matrix.scalarOperate(this,v => Math.asin(v));
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else{
      console.error(`This matrix has been diposed!`);
      return false;
    }
  }
  acos(){
    if(!this.disposed){
      try{
        Matrix.scalarOperate(this,v => Math.acos(v));
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else{
      console.error(`This matrix has been diposed!`);
      return false;
    }
  }
  atan(){
    if(!this.disposed){
      try{
        Matrix.scalarOperate(this,v => Math.atan(v));
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else{
      console.error(`This matrix has been diposed!`);
      return false;
    }
  }
  degToRad(){
    if(!this.disposed){
      try{
        Matrix.scalarOperate(this,v => (v*Math.PI)/180);
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else{
      console.error(`This matrix has been diposed!`);
      return false;
    }
  }
  radToDeg(){
    if(!this.disposed){
      try{
        Matrix.scalarOperate(this,v => (v*180)/Math.PI);
        return this;
      }
      catch(error){
        console.error(error);
        return false;
      }
    }else{
      console.error(`This matrix has been diposed!`);
      return false;
    }
  }
  // --- Reduction ---
  sum(){
    try{
      return Matrix.reduce(this,0,(a,v) => a+v);
    }
    catch(error){
      console.error(error);
      return false;
    }
  }
  product(){
    try{
      return Matrix.reduce(this,1,(a,v) => a*v);
    }
    catch(error){
      console.error(error);
      return false;
    }
  }
  mean(){
    try{
      let weight = 1/(this.shape[0]*this.shape[1]);
      return Matrix.reduce(this,0,(a,v) => a+v*weight);
    }
    catch(error){
      console.error(error);
      return false;
    }
  }
  var(){
    try{
      let weight = 1/(this.shape[0]*this.shape[1]);
      let mean = this.mean();
      return Matrix.reduce(this,0,(a,v) => a+Math.pow(v - mean,2)*weight);
    }
    catch(error){
      console.error(error);
      return false;
    }
  }
  stDev(){
    return Math.sqrt(this.var());
  }
  // --- Multivariate Statistics ---
  meanVector(){
    if(!this.disposed){
      let outArr = [];
      for(let j=0;j<this.shape[1];j++){
        outArr.push(this.getCol(j).mean());
      }
      return new Matrix(outArr,[this.shape[1],1]);
    }else{
      console.error("This matrix has been disposed!");
      return false;
    }
  }
  devMatrix(){
    if(!this.disposed){
      let devMat = this.meanVector().transpose();
      for(let i=0;i<this.shape[0]-1;i++){
        devMat.push(this.meanVector().transpose());
      }
      return this.new().sub(devMat);
    }else{
      console.error("This matrix has been disposed!");
      return false;
    }
  }
  covMatrix(){
    if(!this.disposed){
      let devArr = this.devMatrix().toColArray();
      let covArr = [];
      for(let i=0;i<devArr.length;i++){
        for(let j=0;j<devArr.length;j++){
          covArr.push(devArr[i].innerProduct(devArr[j])/devArr[0].length);
        }
      }
      return new Matrix(covArr,[devArr.length,devArr.length]);
    }else{
      console.error("Matrix has been disposed!");
      return false;
    }
  }
  corrMatrix(){
    if(!this.disposed){
      let covMatrix = this.covMatrix();
      let corrArr = [];
      for(let i=0;i<covMatrix.shape[0];i++){
        for(let j=0;j<covMatrix.shape[1];j++){
          if(i!=j) corrArr.push(covMatrix.get(i,j)/(Math.sqrt(covMatrix.get(i,i))*Math.sqrt(covMatrix.get(j,j))));
          else corrArr.push(1);
        }
      }
      return new Matrix(corrArr,covMatrix.shape[0],covMatrix.shape[1]);
    }else{
      console.error("This matrix has been disposed!");
      return false;
    }
  }
  // --- LinAlg Support ---
  swapRows(r1,r2){
    if(!this.disposed){
      if(r1 < this.shape[0] && r2 < this.shape[0]){
        let temp = this.data[r2];
        this.data[r2] = this.data[r1];
        this.data[r1] = temp;
        return this;
      }else{
        if(r1 >= this.shape[0] && r2 < this.shape[0]){
          console.error(`${r1} doesn't exist in matrix!  Cannot swap rows.  Be sure you're addressing the rows on a zero-index basis!`);
          return false;
        }
        else if(r1 < this.shape[0] && r2 >= this.shape[0]){
          console.error(`${r2} doesn't exist in matrix!  Cannot swap rows.  Be sure you're addressing the rows on a zero-index basis!`);
          return false;
        }
        else if(r1 >= this.shape[0] && r2 >= this.shape[0]){
          console.error(`Both ${r1}, and ${r2} don't exist in matrix!  Cannot swap rows.  Be sure you're addressing the rows on a zero-index basis!`);
          return false;
        }
      }
    }else{
      console.error("Matrix has been disposed! Cannot swap rows.");
      return false;
    }
  }
  swapCols(r1,r2){
    if(!this.disposed){
      if(r1 < this.shape[0] && r2 < this.shape[0]){
        this.transpose();
        let temp = this.data[r2];
        this.data[r2] = this.data[r1];
        this.data[r1] = temp;
        return this.transpose();
      }else{
        if(r1 >= this.shape[0] && r2 < this.shape[0]){
          console.error(`${r1} doesn't exist in matrix!  Cannot swap rows.  Be sure you're addressing the rows on a zero-index basis!`);
          return false;
        }
        else if(r1 < this.shape[0] && r2 >= this.shape[0]){
          console.error(`${r2} doesn't exist in matrix!  Cannot swap rows.  Be sure you're addressing the rows on a zero-index basis!`);
          return false;
        }
        else if(r1 >= this.shape[0] && r2 >= this.shape[0]){
          console.error(`Both ${r1}, and ${r2} don't exist in matrix!  Cannot swap rows.  Be sure you're addressing the rows on a zero-index basis!`);
          return false;
        }
      }
    }else{
      console.error("Matrix has been disposed! Cannot swap rows.");
      return false;
    }
  }
  scaleRow(r,c){
    if(!this.disposed){
      for(let i=0;i<this.shape[0];i++){
        this.data[r][i] *= c;
      }
      return this;
    }else{
      console.error("This matrix has been disposed!");
      return false;
    }
  }
  // --- Linear Algebra ---
  transpose(){
    if(!this.disposed){
      let newData = [];
      for(let i=0;i<this.shape[1];i++){
        newData.push([]);
        for(let j=0;j<this.shape[0];j++){
          newData[i].push(this.data[j][i]);
        }
      }
      this.data = newData;
      this.shape.reverse();
      return this;
    }else{
      console.error("This matrix has been disposed!  Cannot complete transpose.");
      return false;
    }
  }
  innerProduct(b){
    if(!this.disposed){
      return this.flatten().mul(b.flatten()).sum();
    }else{
      console.error("Matrix has been disposed! Cannot take inner product!");
      return false;
    }
  }
  matMul(b){
    if(!this.disposed && !b.disposed){
      if(this.shape[1] == b.shape[0]){
        let outArr = [];
        let newShape = [this.shape[0],b.shape[1]];
        for(let i=0;i<this.shape[0];i++){ // Rows of A
          for(let j=0;j<b.shape[1];j++){ // Cols of B
            outArr.push(this.getRow(i).innerProduct(b.getCol(j)));
          }
        }
        return new Matrix(outArr,newShape);
      }else{
        console.error(`Matricies must match in inner dimensions!  Shape of A: [${this.shape[0]},${this.shape[1]}]; Shape of B: [${b.shape[0]},${b.shape[1]}]`);
        return false;
      }
    }else{
      console.error(`A.disposed = ${a.disposed}; B.disposed = ${b.disposed}`);
      return false;
    }
  }
}
