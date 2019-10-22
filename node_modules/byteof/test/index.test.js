const byteof=require("../index")
const BYTES=require("../BYTES")

describe('Test number',()=>{
    test('Test integer',()=>{
        expect(byteof(2)).toEqual(BYTES.NUMBER)
    })

    test('Test double',()=>{
        expect(byteof(2.0)).toEqual(BYTES.NUMBER)
    })

})

describe('Test string',()=>{
    test('Test empty string',()=>{
        expect(byteof('')).toEqual(0)
    })

    test('Test an unempty string',()=>{
        const str="a test string"
        expect(byteof(str)).toEqual(BYTES.CHAR*str.length)
    })
})

describe('Test boolean',()=>{
    test('Test true',()=>{
        expect(byteof(true)).toEqual(BYTES.BOOLEAN)
    })

    test('Test false',()=>{
        expect(byteof(false)).toEqual(BYTES.BOOLEAN)
    })
})

describe('Test array',()=>{
    test('Test empty array',()=>{
        expect(byteof([])).toEqual(0)
    })

    test('Test simple array',()=>{
        const array=[0,1,2,3,4,5,6,7,8,9]
        expect(byteof(array)).toEqual(BYTES.NUMBER*10)
    })

    test('Test nested array',()=>{
        const array=[0,[1,2,3],[4,5,6,[7,8],9]]
        expect(byteof(array)).toEqual(BYTES.NUMBER*10)
    })
})

describe('Test object',()=>{
    test('Test empty object',()=>{
        expect(byteof({})).toEqual(0)
    })

    test('Test simple object',()=>{
        const obj={
            "n":1,
            "b":true,
            "s":"1234567890"
        }        
        expect(byteof(obj)).toEqual(BYTES.NUMBER+BYTES.BOOLEAN+BYTES.CHAR*10)
    })
})