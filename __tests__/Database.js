import { exportedForTesting } from "../Database";
import { SiMeasure } from "../types";

const {convert_unit} = exportedForTesting
const kg = {symbol:"kg", factor:1/1000, measure: SiMeasure.Weight}
const g = {symbol:"g", factor:1, measure: SiMeasure.Weight}
const oz = { symbol: "oz", factor: 0.035274, measure: SiMeasure.Weight}
const ml = {symbol:"ml", factor:1, measure: SiMeasure.Volume}

test("converts kg -> g", ()=>{
    expect(convert_unit(1, kg, g)).toBe(1000)
})

test("converts oz -> kg", ()=>{
    expect(convert_unit(3, oz, kg)).toBeCloseTo(0.0850)
})

test("doesn't convert ml->g", ()=>{
    expect(convert_unit(1, ml, g)).toBe(null)
})