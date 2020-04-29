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
echo "ansible-playbook --vault-password-file ********* $PLAYBOOK -i $INVENTORY -e {'BLUE_BRANCH': ******, 'GREEN_BRANCH': ********}" > /dev/null

set +x

VAULT_PASSWORD_FILE=$3
BLUE_BRANCH=$4
GREEN_BRANCH=$5

ansible-playbook --vault-password-file $VAULT_PASSWORD_FILE $PLAYBOOK -i $INVENTORY -e "{'BLUE_BRANCH': $BLUE_BRANCH, 'GREEN_BRANCH': $GREEN_BRANCH}"
