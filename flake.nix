{
  description = "Circom bootcamp flake";

  inputs = {
    devenv-root = {
      url = "file+file:///dev/null";
      flake = false;
    };
    nixpkgs.url = "github:cachix/devenv-nixpkgs/rolling";
    fenix.url = "github:nix-community/fenix";
    devenv.url = "github:cachix/devenv";
    devenv.inputs.nixpkgs.follows = "nixpkgs";
    nix2container.url = "github:nlewo/nix2container";
    nix2container.inputs.nixpkgs.follows = "nixpkgs";
    mk-shell-bin.url = "github:rrbutani/nix-mk-shell-bin";
    flake-parts.url = "github:hercules-ci/flake-parts";
    flake-utils.url = "github:numtide/flake-utils";
    foundry.url = "github:shazow/foundry.nix";
    foundry.inputs.nixpkgs.follows = "nixpkgs";
    jupyenv.url = "github:tweag/jupyenv";
    nixpkgs-terraform.url = "github:stackbuilders/nixpkgs-terraform";
  };

  nixConfig = {
    extra-substituters = [
      "https://tweag-jupyter.cachix.org"
      "https://devenv.cachix.org"
      "https://nixpkgs-terraform.cachix.org"
    ];
    extra-trusted-public-keys = [
      "tweag-jupyter.cachix.org-1:UtNH4Zs6hVUFpFBTLaA4ejYavPo5EFFqgd7G7FxGW9g="
      "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw="
      "nixpkgs-terraform.cachix.org-1:8Sit092rIdAVENA3ZVeH9hzSiqI/jng6JiCrQ1Dmusw="
    ];
  };

  outputs = inputs @ {
    flake-parts,
    flake-utils,
    nixpkgs,
    devenv-root,
    jupyenv,
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
      in {
        packages = {inherit jupyterlab;};
        packages.default = jupyterlab;
        apps.default = let
          jupyterPath = "${jupyterlab}/bin/jupyter-lab";
        in {
          type = "app";
          program = jupyterPath;
        };

        devenv.shells.default = {
          devenv.root = let
            devenvRootFileContent = builtins.readFile devenv-root.outPath;
          in
            pkgs.lib.mkIf (devenvRootFileContent != "") devenvRootFileContent;

          name = "Circom shell";

          packages = with pkgs; [
            git
            udev
            pkg-config
            circom
            slither-analyzer
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
          ];
          enterShell = ''
            git --version
            solc --version
            nix --version
            circom --version
            mdbook --version
          '';
          languages = {
            python.enable = true;
            solidity = {
              enable = true;
              foundry.enable = true;
            };
            javascript.enable = true;
            typescript.enable = true;
          };

          scripts = {
          };

          difftastic.enable = true;
          dotenv.enable = true;
          pre-commit = {
            hooks = {
              alejandra.enable = true;
              commitizen.enable = true;
              check-yaml.enable = true;
            };
          };
        };
      };
    };
}
