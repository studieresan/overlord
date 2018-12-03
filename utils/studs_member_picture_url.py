#!/usr/bin/python3

import pymongo
import unicodedata as ud

DB_USER = ''
DB_PASSWORD = ''
DB_URL = ''

# Add Studs members here
STUDS_MEMBERS = [
    'Micky Mick',
    'Lerp Lerpsson',
]

CDN_MEMBERS_URL = ''

uri = 'mongodb://{}:{}@{}'.format(DB_USER, DB_PASSWORD, DB_URL)

normalize = lambda name: ud.normalize('NFKD', name).encode('ASCII', 'ignore').decode('utf-8')
success = '\x1b[6;30;42m[SUCCESS]\x1b[0m '
error = '\x1b[6;30;41m[ERROR]\x1b[0m '

def generate_picture_url(first_name, last_name, file_format='jpg'):
    names = map(lambda n: n.split(' '), [first_name, last_name])
    flattened = [val for sublist in names for val in sublist]
    normalized_name = '-'.join(map(lambda n: normalize(n.lower()), flattened))
    return '{}{}.{}'.format(CDN_MEMBERS_URL, normalized_name, file_format)

def main():
    client = pymongo.MongoClient(uri)
    db = client.get_database()
    user_collection = db['users']
    processed = 0
    print('Processing {} members'.format(len(STUDS_MEMBERS)))
    print()

    for member in STUDS_MEMBERS:
        # Accounting for first names that have spaces
        first_name, last_name = member.rsplit(' ', 1)
        query = {
            'profile.firstName': first_name,
            'profile.lastName': last_name,
            'profile.memberType': 'studs_member',
        }
        count = user_collection.count_documents(query)
        if count > 0:
            if count == 1:
                url = generate_picture_url(first_name, last_name)
                user_collection.update_one(query, 
                        {
                            '$set': {
                                'profile.picture': url
                            }
                        }
                )
                print(success + 'Updated picture URL for {} {} ({})'.format(first_name, last_name, url))
                processed += 1
            else:
                print(error + 'More than one member with the name {} {}, skipping'.format(first_name, last_name))
        else:
            print(error + 'Could not find {} {}'.format(first_name, last_name))
        print()
    client.close()
    print(success + 'Done... updated {}/{} members'.format(processed, len(STUDS_MEMBERS)))

if __name__ == '__main__':
    main()
