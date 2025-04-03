import { useState } from "react";
import { StoreContext } from "./StoreContext";

const StoreContextMain = ({ children }) => {
  const [nailShapesZones, setNailShapesZones] = useState({
    shapeone: 0,
    shapetwo: 0,
    shapethree: 0,
    shapefour: 0,
    shapefive: 0,
    shapesix: 0,
  })
  const [jointRom, setJointRom] = useState({
    ankle: 0,
    subtalar: 0,
    midtarsal: 0,
    tmt: 0,
    mtp1: 0,
    mtp2: 0,
    mtp3: 0,
    mtp4: 0,
    mtp5: 0,
    pip1: 0,
    pip2: 0,
    pip3: 0,
    pip4: 0,
    pip5: 0,
    dip1: 0,
    dip2: 0,
    dip3: 0,
    dip4: 0,
    dip5: 0,
  });

  const [hindFootZones, setHindFootZones] = useState({
    calcanus: 0,
    equinus: 0,
    valgus: 0,
    varus: 0,
    cavus: 0,
    planus: 0,
    pronation: 0,
    adductus: 0,
    adductus2: 0,
    supination: 0,
  });


  const [foreFootZones, setForeFootZones] = useState({
    varus1: 0,
    varus2: 0,
    varus3: 0,
    varus4: 0,
    varus5: 0,
    claw1: 0,
    claw2: 0,
    claw3: 0,
    claw4: 0,
    claw5: 0,
    overriding1: 0,
    overriding2: 0,
    overriding3: 0,
    overriding4: 0,
    overriding5: 0,
    cockup1: 0,
    cockup2: 0,
    cockup3: 0,
    cockup4: 0,
    cockup5: 0,
    valgus1: 0,
    valgus2: 0,
    valgus3: 0,
    valgus4: 0,
    valgus5: 0,
    underriding1: 0,
    underriding2: 0,
    underriding3: 0,
    underriding4: 0,
    underriding5: 0,
  });

  const [footZone, setFootZone] = useState({
    footpath1: 0,
    footpath2: 0,
    footpath3: 0,
    footpath4a: 0,
    footpath4b: 0,
    footpath5a: 0,
    footpath5b: 0,
    footpath6: 0,
    footpath7a: 0,
    footpath7b: 0,
    footpath7c: 0,
    footpath7d: 0,
    footpath7e: 0,
    footpath7f: 0,
    footpath7g: 0,
    footpath7h: 0,
    footpath7i: 0,
    footpath7j: 0,
    footpath7k: 0,
    footpath8: 0,
    footpath9: 0,
    footpath10: 0,
    footpath10a: 0,
    footpath10b: 0,
    footpath10c: 0,
    footpath11: 0,
    footpath12: 0,
    footpath13: 0,
    footpath14: 0,
    footpath15: 0,
    footpath16: 0,
    footpath17: 0,
    footpath18: 0,
    footpath19: 0,
    footpath20a: 0,
    footpath20: 0,
    footpath20b: 0,
    footpath21: 0,
    footpath22: 0,
    footpath22a: 0,
    footpath22b: 0,
    footpath23: 0,
    footpath24: 0,
    footpath25: 0,
    unknown1: 0,
  });

  const [rightFootZone, setRightFootZone] = useState({
    rightFootpath1: 0,
    rightFootpath2: 0,
    rightFootpath3: 0,
    rightFootpath4a: 0,
    rightFootpath4b: 0,
    rightFootpath5a: 0,
    rightFootpath5b: 0,
    rightFootpath6: 0,
    rightFootpath7a: 0,
    rightFootpath7b: 0,
    rightFootpath7c: 0,
    rightFootpath7d: 0,
    rightFootpath7e: 0,
    rightFootpath7f: 0,
    rightFootpath7g: 0,
    rightFootpath7h: 0,
    rightFootpath7i: 0,
    rightFootpath7j: 0,
    rightFootpath7k: 0,
    rightFootpath8: 0,
    rightFootpath9: 0,
    rightFootpath10: 0,
    rightFootpath10a: 0,
    rightFootpath10b: 0,
    rightFootpath10c: 0,
    rightFootpath11: 0,
    rightFootpath12: 0,
    rightFootpath13: 0,
    rightFootpath14: 0,
    rightFootpath15: 0,
    rightFootpath16: 0,
    rightFootpath17: 0,
    rightFootpath18: 0,
    rightFootpath19: 0,
    rightFootpath20a: 0,
    rightFootpath20: 0,
    rightFootpath20b: 0,
    rightFootpath21: 0,
    rightFootpath22: 0,
    rightFootpath22a: 0,
    rightFootpath22b: 0,
    rightFootpath23: 0,
    rightFootpath24: 0,
    rightFootpath25: 0,
    rightUnknown1: 0,
  });
  const [specialTestsZones, setSpecialTestsZone] = useState({
    Silverskiold: 0,
    AnteriorDrawer: 0,
    PosteriorImpingement: 0,
    AnteriorImpingement: 0,
    Unstable1stTMT: 0,
    Webspacetenderness23: 0,
    Webspacetenderness34: 0,
  });

  const [footNailZone, setFootNailZone] = useState({
    leftFootNail1: 0,
    leftFootNail2: 0,
    leftFootNail3: 0,
    leftFootNail4: 0,
    leftFootNail5: 0,
    rightFootNail1: 0,
    rightFootNail2: 0,
    rightFootNail3: 0,
    rightFootNail4: 0,
    rightFootNail5: 0,
  });
  const [feetZone, setFeetZone] = useState({
    leftFeetpath1: 0,
    leftFeetpath2: 0,
    leftFeetpath3: 0,
    leftFeetpath4: 0,
    leftFeetpath5: 0,
    leftFeetpath6: 0,
    leftFeetpath7: 0,
    leftFeetpath8: 0,
    leftFeetpath9: 0,
    leftFeetpath10: 0,
    leftFeetpath11: 0,
    leftFeetpath12: 0,
    leftFeetpath13: 0,
    leftFeetpath14: 0,
    leftFeetpath15: 0,
    leftFeetpath16: 0,
    leftFeetpath17: 0,
    leftFeetpath18: 0,
    leftFeetpath19: 0,
    leftFeetpath20: 0,
    leftFeetpath21: 0,
    leftFeetpath22: 0,
    leftFeetpath23: 0,
    leftFeetpath24: 0,
    leftFeetpath25: 0,
    leftFeetpath26: 0,
    leftFeetpath27: 0,
    leftFeetpath28: 0,
    leftFeetpath29: 0,
    leftFeetpath30: 0,
    leftFeetpath31: 0,
    leftFeetpath32: 0,
    leftFeetpath33: 0,
    leftFeetpath34: 0,
    leftFeetpath35: 0,
    rightFeetpath1: 0,
    rightFeetpath2: 0,
    rightFeetpath3: 0,
    rightFeetpath4: 0,
    rightFeetpath5: 0,
    rightFeetpath6: 0,
    rightFeetpath7: 0,
    rightFeetpath8: 0,
    rightFeetpath9: 0,
    rightFeetpath10: 0,
    rightFeetpath11: 0,
    rightFeetpath12: 0,
    rightFeetpath13: 0,
    rightFeetpath14: 0,
    rightFeetpath15: 0,
    rightFeetpath16: 0,
    rightFeetpath17: 0,
    rightFeetpath18: 0,
    rightFeetpath19: 0,
    rightFeetpath20: 0,
    rightFeetpath21: 0,
    rightFeetpath22: 0,
    rightFeetpath23: 0,
    rightFeetpath24: 0,
    rightFeetpath25: 0,
    rightFeetpath26: 0,
    rightFeetpath27: 0,
    rightFeetpath28: 0,
    rightFeetpath29: 0,
    rightFeetpath30: 0,
    rightFeetpath31: 0,
    rightFeetpath32: 0,
    rightFeetpath33: 0,
    rightFeetpath34: 0,
    rightFeetpath35: 0,
  });

  const increaseFeetPain = (itemId) => {
    if (feetZone[itemId] == 4) {
      setFeetZone((prev) => ({ ...prev, [itemId]: 0 }));
    } else {
      setFeetZone((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

  };

  const handleNailShapeSelect = (itemId) => {
    if (nailShapesZones[itemId] == 1) {
      setNailShapesZones({
        shapeone: 0,
        shapetwo: 0,
        shapethree: 0,
        shapefour: 0,
        shapefive: 0,
        shapesix: 0,
      });
    } else {
      setNailShapesZones({
        shapeone: 0,
        shapetwo: 0,
        shapethree: 0,
        shapefour: 0,
        shapefive: 0,
        shapesix: 0,
      });
      setNailShapesZones((prev) => ({ ...prev, [itemId]: 1 }));
    }

  }
  const increaseForeFootZones = (itemId) => {
    if (foreFootZones[itemId] == 4) {
      setForeFootZones((prev) => ({ ...prev, [itemId]: 0 }));
    } else {
      setForeFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  }

  const increaseFootPain = (itemId) => {
    if (footZone[itemId] == 4) {
      setFootZone((prev) => ({ ...prev, [itemId]: 0 }));
    } else {
      setFootZone((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };
  const increaseRightFootPain = (itemId) => {
    if (rightFootZone[itemId] == 4) {
      setRightFootZone((prev) => ({ ...prev, [itemId]: 0 }));
    } else {
      setRightFootZone((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };

  const increaseNailPain = (itemId) => {
    if (footNailZone[itemId] == 4) {
      setFootNailZone((prev) => ({ ...prev, [itemId]: 0 }));
    } else {
      setFootNailZone((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };
  const increaseSpecialTestsZones = (itemId) => {
    if (specialTestsZones[itemId] == 4) {
      setSpecialTestsZone((prev) => ({ ...prev, [itemId]: 0 }));
    } else {
      setSpecialTestsZone((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };
  const increaseHindFootZones = (itemId) => {
    if (itemId == "calcanus") {
      if (hindFootZones[itemId] == 4) {
        setHindFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (hindFootZones["equinus"] != 0) {
          setHindFootZones((prev) => ({ ...prev, "equinus": 0 }));
        }
        setHindFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
    if (itemId == "equinus") {
      if (hindFootZones[itemId] == 4) {
        setHindFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (hindFootZones["calcanus"] != 0) {
          setHindFootZones((prev) => ({ ...prev, "calcanus": 0 }));
        }
        setHindFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
    if (itemId == "varus") {

      if (hindFootZones[itemId] == 4) {
        setHindFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (hindFootZones["valgus"] != 0) {
          setHindFootZones((prev) => ({ ...prev, "valgus": 0 }));
        }
        setHindFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
    if (itemId == "valgus") {

      if (hindFootZones[itemId] == 4) {
        setHindFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (hindFootZones["varus"] != 0) {
          setHindFootZones((prev) => ({ ...prev, "varus": 0 }));
        }
        setHindFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
    if (itemId == "cavus") {
      if (hindFootZones[itemId] == 4) {
        setHindFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (hindFootZones["planus"] != 0) {
          setHindFootZones((prev) => ({ ...prev, "planus": 0 }));
        }
        setHindFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
    if (itemId == "planus") {
      if (hindFootZones[itemId] == 4) {
        setHindFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (hindFootZones["cavus"] != 0) {
          setHindFootZones((prev) => ({ ...prev, "cavus": 0 }));
        }
        setHindFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
    if (itemId == "pronation") {
      if (hindFootZones[itemId] == 4) {
        setHindFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (hindFootZones["supination"] != 0) {
          setHindFootZones((prev) => ({ ...prev, "supination": 0 }));
        }
        setHindFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
    if (itemId == "supination") {
      if (hindFootZones[itemId] == 4) {
        setHindFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (hindFootZones["pronation"] != 0) {
          setHindFootZones((prev) => ({ ...prev, "pronation": 0 }));
        }
        setHindFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
    if (itemId == "adductus") {
      if (hindFootZones[itemId] == 4) {
        setHindFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (hindFootZones["adductus2"] != 0) {
          setHindFootZones((prev) => ({ ...prev, "adductus2": 0 }));
        }
        setHindFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
    if (itemId == "adductus2") {
      if (hindFootZones[itemId] == 4) {
        setHindFootZones((prev) => ({ ...prev, [itemId]: 0 }));
      } else {
        if (hindFootZones["adductus"] != 0) {
          setHindFootZones((prev) => ({ ...prev, "adductus": 0 }));
        }
        setHindFootZones((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      }
    }
  };
  const increaseJointRom = (itemId) => {
    if (jointRom[itemId] == 4) {
      setJointRom((prev) => ({ ...prev, [itemId]: 0 }));
    } else {
      setJointRom((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };
  const contextValue = {
    increaseSpecialTestsZones,
    increaseJointRom,
    increaseFootPain,
    jointRom,
    footZone,
    increaseRightFootPain,
    hindFootZones,
    increaseHindFootZones,
    increaseFeetPain,
    increaseNailPain,
    rightFootZone,
    setForeFootZones,
    setRightFootZone,
    foreFootZones,
    footNailZone,
    increaseForeFootZones,
    nailShapesZones,
    handleNailShapeSelect,
    specialTestsZones,
    feetZone,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
export default StoreContextMain;
