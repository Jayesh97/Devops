#!/bin/bash

# Exit on error
set -e

# Trace commands as we run them:
set -x

# Print error message and exit with error code 1
function die {
    echo "$1"
    exit 1
}
# Check the number of arguments
[ $# -ge 5 ] || die "usage: $0 <playbook> <inventory> <github_username> <github_password>"

PLAYBOOK=$1
INVENTORY=$2
VAULT_PASSWORD_FILE=$3
GH_USER=$4
GH_PASS=$5

ansible-playbook --vault-password-file $VAULT_PASSWORD_FILE $PLAYBOOK -i $INVENTORY -e "{'GH_USER': $GH_USER, 'GH_PASS': $GH_PASS}"
