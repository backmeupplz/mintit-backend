{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-20_x
    pkgs.yarn
    pkgs.cairo
    pkgs.pango
    pkgs.libjpeg
    pkgs.librsvg
    pkgs.giflib
    pkgs.pixman
  ];
}
