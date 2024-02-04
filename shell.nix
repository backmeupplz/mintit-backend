{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [
    pkgs.pixman
    pkgs.cairo
    pkgs.pango
    pkgs.libjpeg
    pkgs.giflib
  ];
}