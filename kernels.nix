{pkgs, ...}: {
  kernel.python.zk = {
    enable = true;
    displayName = "ZK RareSkills Kernel";
    extraPackages = ps: [ps.numpy ps.scipy ps.sympy ps.ecpy ps.py-ecc ps.web3 ps.jsonSchema];
  };
}
