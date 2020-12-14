import { readFileSync } from "fs";

export {};

type instruction = {
  type: "mask" | "mem";
  mask?: string;
  memoryAddress?: bigint;
  value?: bigint;
};

const getInstructions = (vs: string[]): instruction[] => {
  const maskRegex = /mask = (\w+)/;
  const memRegex = /mem\[(\d+)\] = (\d+)/;

  return vs.map((v) => {
    if (v.match(maskRegex)) {
      const [_, mask] = v.match(maskRegex);
      return {
        type: "mask",
        mask,
      };
    }

    const [_, memoryAddress, value] = v.match(memRegex);
    return {
      type: "mem",
      memoryAddress: BigInt(memoryAddress),
      value: BigInt(value),
    };
  });
};

const applyMask = (mask: string, value: bigint): bigint => {
  let valueString = value.toString(2).split("");
  const prefix = new Array(mask.length - valueString.length).fill("0");
  valueString = prefix.concat(valueString);

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === "X") {
      continue;
    }

    valueString[i] = mask[i];
  }

  return BigInt("0b".concat(valueString.join("")));
};

const main = (vs: string[]) => {
  const is = getInstructions(vs);

  let currentMask = null;
  let memory = new Map<bigint, bigint>();
  for (const i of is) {
    if (i.type === "mask") {
      currentMask = i.mask!;
      continue;
    }

    memory.set(i.memoryAddress, applyMask(currentMask, i.value!));
  }

  let sum = BigInt(0);
  memory.forEach((v) => {
    sum += v;
  });
  return sum;
};

const main2 = (vs: string[]) => {};

const [vt, v] = ["inputT.txt", "input.txt"].map((fileName) =>
  readFileSync(`${__dirname}/${fileName}`).toString().split("\n")
);

console.log("First Half");
console.log("test", main(vt));
console.log("final", main(v));
console.log("==========");
console.log("Second Half");
console.log("test", main2(vt));
console.log("final", main2(v));
