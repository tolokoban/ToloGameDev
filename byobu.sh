#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"


NAME=ToloGameDev
if [ -z "$(byobu-tmux list-sessions | grep '$NAME')" ]
then
  byobu-tmux new-session -d -t $NAME

  byobu-tmux new-window
  byobu-tmux rename-window TFW-blurry-preview
  byobu-tmux send-keys -t 0 "cd $DIR" 'C-m'
  byobu-tmux send-keys -t 0 'code .' 'C-m'
  byobu-tmux send-keys -t 0 'npm run' 'C-m'

  byobu-tmux new-window
  byobu-tmux rename-window '(lib)'
  byobu-tmux send-keys -t 0 "cd $DIR/lib" 'C-m'
  byobu-tmux send-keys -t 0 'npm test' 'C-m'
  byobu-tmux split-window -h
  byobu-tmux send-keys -t 1 "cd $DIR/lib" 'C-m'
  byobu-tmux send-keys -t 1 'npm start' 'C-m'

  byobu-tmux new-window
  byobu-tmux rename-window '(doc)'
  byobu-tmux send-keys -t 0 "cd $DIR/doc" 'C-m'
  byobu-tmux send-keys -t 0 'npm test' 'C-m'
  byobu-tmux split-window -h
  byobu-tmux send-keys -t 1 "cd $DIR/doc" 'C-m'
  byobu-tmux send-keys -t 1 'npm link tfw-blurry-preview' 'C-m'
  byobu-tmux send-keys -t 1 'npm start' 'C-m'
fi
# Enter byobu-tmux
byobu-tmux attach -t $NAME
