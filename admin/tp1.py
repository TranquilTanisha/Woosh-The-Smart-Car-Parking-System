from config import authenticator, db, session, auth
from datetime import datetime

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

# ref=db.collection('organization').document('8WP1uuHtHnXJ5JcmV8tNbmip9C83').collection('2024-04-03')
# docs=ref.get()
# print(len(docs))

ref=db.collection('alerts').document('0yCprQEL4XNRO22HxhxMfvSqYSF2')
ref.update({'op33KxzXvCSHmXScKREV6bLVu5g2': datetime.now().strftime('%Y-%m-%d %H:%M:%S')})
# print(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

def search(email="shah.dhyey@gmail.com"):
    ref=db.collection('employees').stream()
    for doc in ref:
        doc=doc.to_dict()
        for k,v in doc.items():
            if v == email:
                return k
    # doc=ref.get()
    # if doc.exists:
    #     doc=doc.to_dict()
    #     for k,v in doc.items():
    #         if v == email:
    #             return k
        else:
            return None
# k=search()
# print(k)