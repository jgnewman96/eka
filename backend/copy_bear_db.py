"""
Script to copy bear database into a text file
"""

import argparse
import datetime
import logging
import pathlib
import re
import shutil
import sqlite3
import sys
from typing import Optional, Sequence, Text

import pandas as pd


def convert_column_to_datetime(x):
    offset = 18000
    return datetime.datetime(2001, 1, 1)  + datetime.timedelta(seconds=x - offset)

def get_tags(text):
    try:
        tag_line = text.split('\n')[1]
    except (IndexError, AttributeError):
        return []
    tag_list = tag_line.split('##')
    tag_list = [l.replace('#', '').lower() for l in tag_list]
    return tag_list

def get_block_titles_from_text(text):
    blocks = text.split('****')
    block_titles = []
    for block in blocks:
        lines = block.split('\n')
        for line in lines:
            if '## ' in line:
                title = line.replace('## ', '')
                block_titles.append(title)
                break
    return block_titles

def get_block_text(text):
    blocks = text.split('****')
    block_texts = []
    for block in blocks[1:]:
        lines = re.findall(r'^(?!##).*', block, flags=re.MULTILINE) # use regex to find all lines that don't start with '##'[1]
        result = '\n'.join(lines)
        block_texts.append(result)
    return block_texts

def make_filename_from_title(title):
    title = title.lower()
    title = title.replace(" ", "_")
    return title

def get_status_from_tags(tags):
    if "abandoned" in tags:
        return "Abandoned"
    if "finished" in tags:
        return "Finished"
    else:
        return "In Progress"

def find_links_to_other_pieces(text):
    matches = re.findall(r"\[\[(.*?)\]\]", text)
    return matches

def replace_links_to_other_pieces(text):

    def create_link_string(match):
        title = match.group(1)
        filename = make_filename_from_title(title)
        return f"[{title}](/{filename})"

    new_text_str = re.sub(r"\[\[(.*?)\]\]", create_link_string, text)


    return new_text_str




# pylint: disable=missing-docstring
def main(arguments: Optional[Sequence[Text]]) -> Optional[int]:

    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )

    parser.add_argument(
        "--path_to_db",
        help="path_to_db",
        type=str,
        required=True,
    )
    args = parser.parse_args(arguments)
    

    my_file = pathlib.Path(args.path_to_db)
    to_file = pathlib.Path('../database.sqlite')
    shutil.copy(my_file, to_file)

    connection = sqlite3.connect(str(to_file))
    cursor = connection.cursor()
    rows = cursor.execute("select ZCREATIONDATE, ZMODIFICATIONDATE, ZTRASHED, ZTITLE, ZTEXT from ZSFNOTE order by ZMODIFICATIONDATE").fetchall()

    
    colnames=['created', 'modified', 'trashed', 'title', 'text'] 
    notes = pd.DataFrame(rows, columns = colnames)
    notes = notes[notes['trashed'] == False]


    tags_to_remove = ['literature',
               'correspondence',
              'finished', 
              'abandoned', 
              'workouts',
              "",
              'applications'
              ]


    notes['created'] = notes['created'].apply(convert_column_to_datetime)
    notes['modified'] = notes['modified'].apply(convert_column_to_datetime)
    notes['tags'] = notes['text'].apply(get_tags)
    notes['status'] = notes['tags'].apply(get_status_from_tags)
    notes['tags'] = notes['tags'].apply(lambda x: [t for t in x if t not in tags_to_remove])

    notes = notes[notes['tags'].apply(lambda x: len(x) > 0)]
    notes = notes.reset_index(False)


    notes['links_to'] = notes['text'].apply(find_links_to_other_pieces)
    notes['text'] = notes['text'].apply(replace_links_to_other_pieces)


    notes['blocks'] = notes['text'].apply(get_block_titles_from_text)
    notes['blocks_text'] = notes['text'].apply(get_block_text)

    notes["filename"] = notes['title'].apply(make_filename_from_title)  

    notes[['created', 'modified', 'title', 
           'status', 'tags', 'blocks', 
           'blocks_text', 'filename']].to_json("../frontend/public/metadata.json", orient='records')  

    
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
