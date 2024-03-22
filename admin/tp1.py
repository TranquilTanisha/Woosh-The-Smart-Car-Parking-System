from config import authenticator, db, session, auth

ref=db.collection('organization').document('1')
doc=ref.get()
if doc.exists:
    print(f'Document data: {doc.to_dict()}')

ref=db.collection('organization')
docs=ref.stream()
print(docs)
for doc in docs:
    print(f'{doc.id} => {doc.to_dict()}')