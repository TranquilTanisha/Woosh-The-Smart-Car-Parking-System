from config import authenticator, db, session, auth

# ref=db.collection('organization').document('1')
# doc=ref.get()
# if doc.exists:
#     print(f'Document data: {doc.to_dict()}')

# ref=db.collection('organization')
# docs=ref.stream()
# for doc in docs:
#     print(f'{doc.id} => {doc.to_dict()}')

# from datetime import datetime
# from datetime import time
# print(datetime.time(datetime.now()))

# ref=db.collection('organization').document('8WP1uuHtHnXJ5JcmV8tNbmip9C83')
# # ref=db.collection('organization').collections()
# r=ref.collections()
# collection = [collection.id for collection in r]+['2024-03-02']
# print(collection[0].split('-')[1][1])
# # subcollection_names.sort(reverse=True)
# # print(subcollection_names)

ref=db.collection('organization').document('8WP1uuHtHnXJ5JcmV8tNbmip9C83').collection('2024-04-03')
docs=ref.stream()
for doc in docs:
    print(doc.to_dict())