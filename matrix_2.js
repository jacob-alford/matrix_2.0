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
      if(a.shape[0] == b.shape[0] && a.shape[1] == b.shape[1]){
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
      if(a.shape[0] == b.shape[0] && a.shape[1] == b.shape[1]){
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
      if(a.shape[0] == b.shape[0] && a.shape[1] == b.shape[1]){
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
      if(a.shape[0] == b.shape[0] && a.shape[1] == b.shape[1]){
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
}
