workflow "Deploy npm build on gh-pages" {
  on = "push"
  resolves = ["Deploy"]
}

action "With Master Branch" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Install npm dependencies" {
  uses = "actions/npm@master"
  args = "install"
  needs = ["With Master Branch"]
}

action "Build" {
  uses = "actions/npm@master"
  needs = ["Install npm dependencies"]
  args = "run build"
}

action "Deploy" {
  uses = "maxheld83/ghpages@v0.2.1"
  needs = ["Build"]
  env = {
    BUILD_DIR = "."
  }
  secrets = ["GITHUB_TOKEN"]
}
