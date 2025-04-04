{
  description = "Rareskills Circom bootcamp flake";

  inputs = {
    devenv-root = {
      url = "file+file:///dev/null";
      flake = false;
    };
    #nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    #nixpkgs.url = "github:glottologist/nixpkgs/master";
    nixpkgs.url = "github:glottologist/nixpkgs/release-24.11";

    fenix.url = "github:nix-community/fenix";
    devenv.url = "github:cachix/devenv";
    devenv.inputs.nixpkgs.follows = "nixpkgs";
    jupyenv.url = "github:tweag/jupyenv";
    foundry.url = "github:shazow/foundry.nix";
    foundry.inputs.nixpkgs.follows = "nixpkgs";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  nixConfig = {
    extra-substituters = [
      "https://tweag-jupyter.cachix.org"
      "https://devenv.cachix.org"
    ];
    extra-trusted-public-keys = [
      "tweag-jupyter.cachix.org-1:UtNH4Zs6hVUFpFBTLaA4ejYavPo5EFFqgd7G7FxGW9g="
      "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw="
    ];
  };

  outputs = inputs @ {
    flake-parts,
    nixpkgs,
    fenix,
    jupyenv,
    devenv-root,
    ...
  }:
    flake-parts.lib.mkFlake {inherit inputs;} {
      imports = [
        inputs.devenv.flakeModule
      ];

      systems = inputs.nixpkgs.lib.systems.flakeExposed;

      perSystem = {
        config,
        self',
        inputs',
        pkgs,
        system,
        ...
      }: let
        inherit (jupyenv.lib.${system}) mkJupyterlabNew;
        jupyterlab = mkJupyterlabNew ({...}: {
          nixpkgs = inputs.nixpkgs;
          imports = [(import ./kernels.nix)];
        });
      in rec
      {
        packages = {inherit jupyterlab;};
        packages.default = jupyterlab;
        apps.default.program = "${jupyterlab}/bin/jupyter-lab";
        apps.default.type = "app";

        devenv.shells.default = {
          devenv.root = let
            devenvRootFileContent = builtins.readFile devenv-root.outPath;
          in
            pkgs.lib.mkIf (devenvRootFileContent != "") devenvRootFileContent;
          name = "Circom shell";
          packages = with pkgs; [
            git
            slither-analyzer
            circom
            solc
            mdbook
            mdbook-i18n-helpers
            mdbook-mermaid
            mdbook-toc
            mdbook-katex
            python312Packages.numpy
            python312Packages.scipy
            python312Packages.sympy
            python312Packages.ecpy
            python312Packages.py-ecc
            python312Packages.web3
            python312Packages.jsonschema
            nodePackages.ganache
          ];
          enterShell = ''
            git --version
            nix --version
            solc --version
            circom --version
            mdbook --version
          '';
          languages = {
            nix.enable = true;
            python.enable = true;
            javascript.enable = true;
            typescript.enable = true;
          };
          dotenv.enable = true;
          devcontainer.enable = true;
          difftastic.enable = true;
          pre-commit.hooks = {
            alejandra.enable = true;
            commitizen.enable = true;
            prettier.enable = true;
          };
        };
      };
    };
}
