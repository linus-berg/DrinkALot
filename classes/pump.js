class Pump {
  constructor(en, in1, in2) {
    /* RPI pins */
    this.en = en;
    this.in1 = in1;
    this.in2 = in2;
    this.Stop(); 
  }

  Run(speed) {
    this.en.write(speed);
    this.in1.write(1);
  }

  Stop() {
    this.en.write(0);
    this.in1.write(0);
    this.in2.write(0);
  }
}

module.exports = Pump;
