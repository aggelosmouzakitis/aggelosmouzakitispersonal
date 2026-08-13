# -*- coding: utf-8 -*-
"""Self-contained Greek Burnout Diagnostic (vanilla JS). Copy supplied by the client."""
import json

TITLE = "Burnout Τεστ | Δωρεάν Εργαλείο Αυτοαξιολόγησης"
DESC = ("Δωρεάν burnout test 45 ερωτήσεων. Δες το συνολικό επίπεδο επιβάρυνσης και ποια "
        "μοτίβα επηρεάζουν περισσότερο τη σχέση σου με τη δουλειά.")

# ── 12 internal sections (ids/keys fixed; titles + questions from client) ─────
SECTIONS = [
    {"id": "self-worth", "key": "self_worth", "title": "Αυτοεκτίμηση και επιτεύγματα", "q": [
        "Μια κακή περίοδος στη δουλειά μπορεί να επηρεάσει σημαντικά την αυτοπεποίθησή μου.",
        "Όταν δεν τα πηγαίνω καλά επαγγελματικά, γίνομαι πιο αυστηρός με τον εαυτό μου.",
        "Μου είναι ευκολότερο να νιώθω καλά με τον εαυτό μου όταν τα επαγγελματικά μου πηγαίνουν καλά."]},
    {"id": "shame-guilt-pressure", "key": "shame_guilt_pressure", "title": "Ενοχή και εσωτερική πίεση", "q": [
        "Δυσκολεύομαι να χαλαρώσω όταν γνωρίζω ότι υπάρχει ακόμη δουλειά που πρέπει να γίνει.",
        "Μπορεί να κάθομαι να ξεκουραστώ και να σκέφτομαι ότι θα έπρεπε να είμαι παραγωγικός.",
        "Τείνω να εστιάζω περισσότερο σε όσα δεν έχω ακόμη καταφέρει παρά σε όσα έχω ήδη κάνει."]},
    {"id": "comparison", "key": "comparison", "title": "Σύγκριση και αίσθηση ανεπάρκειας", "q": [
        "Όταν βλέπω άλλους να προοδεύουν, αρχίζω να αμφισβητώ τη δική μου απόδοση.",
        "Όταν ένας άνθρωπος κοντά μου προχωρά γρήγορα, σκέφτομαι αμέσως σε ποια σημεία έχω μείνει πίσω.",
        "Μπορεί να έχω αντικειμενικά καλά αποτελέσματα και παρ’ όλα αυτά να νιώθω ότι δεν έχω προχωρήσει αρκετά."]},
    {"id": "vulnerability", "key": "vulnerability", "title": "Δυσκολία με την ευαλωτότητα", "q": [
        "Νιώθω άβολα όταν οι άνθρωποι που είναι κοντά μου με βλέπουν να δυσκολεύομαι ή να αμφιβάλλω.",
        "Όταν περνάω μια δύσκολη περίοδο, το πρώτο μου ένστικτο είναι να το κρατήσω για τον εαυτό μου.",
        "Προτιμώ να αντιμετωπίζω κάτι χωρίς βοήθεια παρά να δείξω ότι δεν είμαι σίγουρος ή ότι δεν έχω τον έλεγχο."]},
    {"id": "grind", "key": "grind", "title": "Υπερηφάνεια για την αντοχή", "q": [
        "Έχω συνηθίσει να αναλαμβάνω πολλά χωρίς να λέω ότι δυσκολεύομαι.",
        "Ένα μέρος μου νιώθει υπερηφάνεια για το πόση πίεση μπορώ να αντέξω.",
        "Το να επιβραδύνω μου προκαλεί δυσφορία, ακόμη και όταν γνωρίζω ότι το χρειάζομαι."]},
    {"id": "identity", "key": "identity", "title": "Ταυτότητα και εικόνα", "q": [
        "Οι άλλοι με βλέπουν ως τον άνθρωπο που θα βρει τρόπο να τα καταφέρει.",
        "Το να θεωρώ τον εαυτό μου ικανό αποτελεί σημαντικό μέρος της ταυτότητάς μου.",
        "Με επηρεάζει έντονα όταν απογοητεύω ανθρώπους που περιμένουν πολλά από εμένα.",
        "Οι άλλοι μου λένε συχνά ότι είμαι υπερβολικά αυστηρός με τον εαυτό μου ή ότι πιέζομαι περισσότερο απ’ όσο χρειάζεται."]},
    {"id": "relationships", "key": "relationships", "title": "Σχέσεις και συναισθηματική παρουσία", "q": [
        "Όταν η δουλειά είναι ιδιαίτερα απαιτητική, έχω λιγότερη υπομονή με ανθρώπους που δεν καταλαβαίνουν την πίεση που περνάω.",
        "Όταν έχω έντονο stress, γίνομαι πιο απότομος, κλειστός ή δύσκολος στην επικοινωνία.",
        "Υπάρχουν περίοδοι που είμαι τόσο φορτωμένος ώστε δεν είμαι πραγματικά παρών με τους ανθρώπους γύρω μου.",
        "Η σχέση με τον ή τη σύντροφό μου έχει επηρεαστεί από τον τρόπο που μεταφέρω το άγχος της δουλειάς στην προσωπική μου ζωή.",
        "Υπάρχουν στιγμές που ο ή η σύντροφός μου με νιώθει απόμακρο, απών ή συναισθηματικά μη διαθέσιμο."]},
    {"id": "drive-meaning", "key": "drive_meaning", "title": "Απώλεια κινήτρου και νοήματος", "q": [
        "Έχω αρχίσει να δυσανασχετώ με κομμάτια της δουλειάς που παλαιότερα μου έδιναν ικανοποίηση.",
        "Μου λείπει η περίοδος κατά την οποία ήταν ευκολότερο να νιώσω ενδιαφέρον ή χαρά για τη δουλειά μου."]},
    {"id": "numbness", "key": "numbness", "title": "Συναισθηματικό μούδιασμα και αποσύνδεση", "q": [
        "Μπορεί να περάσει ολόκληρη ημέρα και να νιώθω συναισθηματικά επίπεδος ή άδειος.",
        "Πράγματα που παλαιότερα με ενδιέφεραν δεν με αγγίζουν πια με τον ίδιο τρόπο.",
        "Μπορώ να συνεχίζω να είμαι παραγωγικός, ενώ νιώθω αποσυνδεδεμένος από αυτό που κάνω.",
        "Συχνά νιώθω λιγότερο σαν τον εαυτό μου και περισσότερο σαν να εκτελώ απλώς τις υποχρεώσεις μου.",
        "Υπάρχουν στιγμές που αναρωτιέμαι ποιο είναι τελικά το νόημα όλης αυτής της προσπάθειας."]},
    {"id": "cynicism", "key": "cynicism", "title": "Κυνισμός και αποστασιοποίηση", "q": [
        "Έχω γίνει πιο κυνικός απέναντι στη δουλειά μου απ’ ό,τι ήμουν παλαιότερα.",
        "Ορισμένα κομμάτια της δουλειάς έχουν γίνει μηχανικά, ακόμη και όταν εξακολουθώ να τα εκτελώ καλά.",
        "Υπάρχουν περίοδοι που νιώθω περισσότερο παρατηρητής παρά πραγματικά μέρος αυτού που κάνω."]},
    {"id": "nervous-system", "key": "nervous_system", "title": "Σωματική και νευρική επιβάρυνση", "q": [
        "Μπορεί να είμαι εξαντλημένος και παρ’ όλα αυτά να μην μπορώ να χαλαρώσω πραγματικά.",
        "Ο ύπνος δεν με αφήνει πάντοτε να νιώθω ουσιαστικά ξεκούραστος.",
        "Το άγχος έχει αρχίσει να εμφανίζεται και σωματικά, για παράδειγμα ως πονοκέφαλος, μυϊκή ένταση, στομαχική ενόχληση ή ναυτία.",
        "Το σώμα μου παραμένει σε ένταση ακόμη και όταν δεν εργάζομαι."]},
    {"id": "tech-activation", "key": "tech_activation", "title": "Διαρκής σύνδεση με τη δουλειά", "q": [
        "Ακόμη και όταν δεν εργάζομαι, ένα μέρος μου παραμένει σε ετοιμότητα.",
        "Ελέγχω μηνύματα ή θέματα της δουλειάς σε χρόνο που θα ήθελα να είναι πραγματικά προσωπικός.",
        "Μου είναι δύσκολο να αισθανθώ ότι είμαι εντελώς εκτός δουλειάς.",
        "Το μυαλό μου παραμένει απασχολημένο με τη δουλειά περισσότερο απ’ όσο θα ήθελα.",
        "Νιώθω πίεση να απαντήσω γρήγορα, ακόμη και όταν δεν είναι πραγματικά απαραίτητο.",
        "Όταν δυσκολεύομαι, καταφεύγω συχνά σε AI, self-help περιεχόμενο ή άλλες γρήγορες λύσεις, αλλά σπάνια αλλάζει κάτι ουσιαστικά.",
        "Διαβάζω ή ακούω συχνά συμβουλές για burnout, άγχος και απόδοση, αλλά παραμένω παγιδευμένος στα ίδια μοτίβα."]},
]

SCALE = [{"v": 1, "l": "Διαφωνώ απόλυτα"}, {"v": 2, "l": "Διαφωνώ"},
         {"v": 3, "l": "Ούτε συμφωνώ ούτε διαφωνώ"}, {"v": 4, "l": "Συμφωνώ"},
         {"v": 5, "l": "Συμφωνώ απόλυτα"}, {"v": "na", "l": "Δ/Α"}]

LEVELS = [
    {"max": 2.25, "grade": "Επίπεδο 1 — Σταθερά, με πρώτες ενδείξεις πίεσης",
     "desc": "Συνεχίζεις να λειτουργείς σχετικά σταθερά. Υπάρχουν, όμως, ορισμένες πρώτες ενδείξεις ότι κάποιες περιοχές αρχίζουν να σε επιβαρύνουν. Δεν μιλάμε για κατάσταση κρίσης. Αυτό είναι το κατάλληλο σημείο για πρόληψη, μεγαλύτερη επίγνωση και μικρές αλλαγές πριν το κόστος γίνει σημαντικότερο.",
     "next": "Δες ποιες περιοχές αρχίζουν να σου αφαιρούν περισσότερη ενέργεια και αντιμετώπισέ τες πριν παγιωθούν. Οι μικρές αλλαγές έχουν μεγαλύτερη επίδραση όταν γίνονται νωρίς."},
    {"max": 2.9, "grade": "Επίπεδο 2 — Αποδίδεις, αλλά με αυξανόμενο κόστος",
     "desc": "Εξακολουθείς να ανταποκρίνεσαι στις απαιτήσεις, αλλά η προσπάθεια αρχίζει να σου κοστίζει περισσότερο απ’ όσο σου επιστρέφει. Μπορεί να παρατηρείς μεγαλύτερη συναισθηματική κόπωση, πιο αργή ανάκαμψη, ευερεθιστότητα, λιγότερη ικανοποίηση ή μεγαλύτερη εξάρτηση από τα αποτελέσματα για να νιώσεις καλά με τον εαυτό σου.",
     "next": "Αυτό είναι το σημείο στο οποίο οι πρακτικές και ψυχολογικές αλλαγές μπορούν να αποδώσουν περισσότερο. Μην περιμένεις μέχρι η «απόδοση με κόστος» να γίνει ο μόνιμος τρόπος λειτουργίας σου."},
    {"max": 3.5, "grade": "Επίπεδο 3 — Υψηλή λειτουργικότητα, εσωτερική εξάντληση",
     "desc": "Εξωτερικά μπορεί να συνεχίζεις να ανταποκρίνεσαι και να φαίνεται ότι όλα λειτουργούν. Εσωτερικά, όμως, η επιβάρυνση είναι σημαντική. Η συναισθηματική αποσύνδεση, η ένταση στις σχέσεις, η αδυναμία να χαλαρώσεις και τα σωματικά σημάδια γίνονται όλο και δυσκολότερο να αγνοηθούν.",
     "next": "Σε αυτό το επίπεδο, η απλή διαχείριση των συμπτωμάτων συνήθως δεν αρκεί. Χρειάζεται να εξεταστεί τι συντηρεί το φορτίο: ο τρόπος που δουλεύεις, η σχέση σου με την απόδοση, τα όρια, η ταυτότητα και οι πραγματικές συνθήκες του επαγγελματικού περιβάλλοντος."},
    {"max": 99, "grade": "Επίπεδο 4 — Έντονη εξουθένωση και αποσύνδεση",
     "desc": "Σε αυτό το επίπεδο, το ζήτημα δεν περιορίζεται πλέον στο εργασιακό άγχος. Ο τρόπος που λειτουργείς φαίνεται να επηρεάζει ουσιαστικά την ενέργεια, το σώμα, τις σχέσεις, την αίσθηση νοήματος και τη σχέση σου με τον ίδιο σου τον εαυτό. Μπορεί να συνεχίζεις να λειτουργείς εξωτερικά, αλλά η σύνδεση με την ικανοποίηση, τις αξίες και τη ζωή έξω από τη δουλειά έχει μειωθεί σημαντικά.",
     "next": "Δεν είναι θέμα περισσότερης θέλησης, πειθαρχίας ή καλύτερου time management. Χρειάζεται σοβαρή επανεξέταση του τρόπου με τον οποίο σχετίζεσαι με τη δουλειά, την επιτυχία και τη φιλοδοξία — καθώς και των πραγματικών συνθηκών που σε κρατούν σε αυτή την κατάσταση."},
]

DIMS = [
    {"id": "aw", "title": "Επιτεύγματα και αυτοεκτίμηση", "ids": ["self-worth", "comparison"],
     "lo": "Η αίσθηση της αξίας σου δεν φαίνεται να εξαρτάται έντονα από το τελευταίο επαγγελματικό αποτέλεσμα. Μπορείς να περάσεις μια δύσκολη περίοδο χωρίς να μετατρέπεται αυτόματα σε αμφισβήτηση ολόκληρου του εαυτού σου. Αυτή είναι μια σημαντική προστατευτική βάση.",
     "me": "Η αυτοεκτίμησή σου στηρίζεται στα επαγγελματικά αποτελέσματα περισσότερο απ’ όσο ίσως θα ήθελες. Οι καλές περίοδοι σε ανεβάζουν, ενώ οι δυσκολίες σε επηρεάζουν βαθύτερα απ’ όσο δικαιολογούν τα ίδια τα γεγονότα.",
     "hi": "Αυτή την περίοδο, η αίσθηση της αξίας σου φαίνεται να είναι στενά δεμένη με την απόδοση. Οι επιτυχίες σε καθησυχάζουν προσωρινά, οι αποτυχίες βιώνονται προσωπικά και ο πήχης μετακινείται διαρκώς ψηλότερα. Αυτό το μοτίβο συχνά τροφοδοτεί αρκετές από τις υπόλοιπες περιοχές επιβάρυνσης."},
    {"id": "pr", "title": "Εσωτερική πίεση και απαιτήσεις", "ids": ["shame-guilt-pressure", "grind"],
     "lo": "Φαίνεται ότι μπορείς να ξεκουραστείς χωρίς να κυριαρχούν οι ενοχές. Η πίεση που νιώθεις προέρχεται κυρίως από τις πραγματικές απαιτήσεις του περιβάλλοντος και λιγότερο από μια μόνιμη εσωτερική απαίτηση.",
     "me": "Ένα σημαντικό μέρος της πίεσης φαίνεται να προέρχεται από εσένα. Η ξεκούραση συνοδεύεται από ενοχή και το σημείο στο οποίο λες «έκανα αρκετά» μετακινείται συνεχώς.",
     "hi": "Η μεγαλύτερη πίεση φαίνεται να δημιουργείται εσωτερικά. Το να επιβραδύνεις μοιάζει περισσότερο επικίνδυνο παρά ανακουφιστικό. Η απαίτηση να συνεχίσεις, να πετύχεις ή να αποδείξεις σπάνια υποχωρεί πραγματικά."},
    {"id": "iv", "title": "Ταυτότητα και ευαλωτότητα", "ids": ["identity", "vulnerability"],
     "lo": "Μπορείς να δείξεις ότι αμφιβάλλεις ή δυσκολεύεσαι χωρίς να αισθάνεσαι ότι απειλείται η εικόνα ή η ταυτότητά σου. Αυτή η ευελιξία σε βοηθά να ζητάς υποστήριξη πριν η πίεση γίνει υπερβολική.",
     "me": "Το να είσαι ο ικανός και συγκροτημένος άνθρωπος έχει σημαντικό βάρος για την εικόνα που έχεις για τον εαυτό σου. Το να δείξεις ότι δυσκολεύεσαι μπορεί να σου φαίνεται ριψοκίνδυνο, με αποτέλεσμα να αναλαμβάνεις περισσότερα μόνος σου απ’ όσο χρειάζεται.",
     "hi": "Η ταυτότητά σου είναι έντονα επενδεδυμένη στο να είσαι ικανός, αξιόπιστος και δύσκολο να απογοητεύσεις. Η ευαλωτότητα μοιάζει επικίνδυνη, οπότε η πίεση μένει κρυμμένη. Αυτό περιορίζει την υποστήριξη που μπορείς να δεχτείς και συντηρεί την εξάντληση."},
    {"id": "em", "title": "Συναισθηματική διαθεσιμότητα και σχέσεις", "ids": ["relationships"],
     "lo": "Η επαγγελματική πίεση δεν φαίνεται να επηρεάζει σημαντικά το πόσο παρών είσαι με τους ανθρώπους που βρίσκονται κοντά σου. Υπάρχει ακόμη ουσιαστικός χώρος για σύνδεση έξω από τη δουλειά.",
     "me": "Μέρος της επαγγελματικής πίεσης περνά στις σχέσεις σου. Μπορεί να έχεις λιγότερη υπομονή, μικρότερη συναισθηματική διαθεσιμότητα ή να είσαι πιο απότομος και απόμακρος απ’ όσο θα ήθελες.",
     "hi": "Ο τρόπος με τον οποίο λειτουργείς στη δουλειά έχει αρχίσει να έχει σημαντικό κόστος και στις προσωπικές σου σχέσεις. Οι άνθρωποι που βρίσκονται πιο κοντά σου μπορεί να συναντούν κυρίως την εξαντλημένη, κλειστή ή απούσα εκδοχή σου. Αν δεν αλλάξει κάτι, αυτή η απόσταση συνήθως μεγαλώνει."},
    {"id": "mf", "title": "Νόημα και ικανοποίηση", "ids": ["drive-meaning", "numbness", "cynicism"],
     "lo": "Η δουλειά εξακολουθεί να σου επιστρέφει κάτι ουσιαστικό. Δεν λειτουργείς μόνο από συνήθεια ή υποχρέωση. Υπάρχει ακόμη ενδιαφέρον, σύνδεση ή πραγματική ικανοποίηση.",
     "me": "Η ανταμοιβή που παίρνεις από τη δουλειά έχει αρχίσει να μειώνεται. Μπορεί να εξακολουθείς να αποδίδεις, αλλά η κίνηση συνεχίζεται περισσότερο από συνήθεια, ευθύνη ή φόρα παρά από πραγματικό ενδιαφέρον.",
     "hi": "Η επιτυχία δεν φαίνεται πλέον να σε ανταμείβει συναισθηματικά. Μπορεί να υπάρχει μούδιασμα, αποστασιοποίηση και η επίμονη σκέψη «για ποιο λόγο γίνεται όλη αυτή η προσπάθεια;», ακόμη και όταν εξωτερικά συνεχίζεις να τα καταφέρνεις. Αυτή είναι μια από τις σημαντικότερες περιοχές ως προς τη συνολική αίσθηση πληρότητας."},
    {"id": "ns", "title": "Σωματική και νευρική επιβάρυνση", "ids": ["nervous-system"],
     "lo": "Το σώμα σου φαίνεται να ανακάμπτει σχετικά αποτελεσματικά από την πίεση. Δεν υπάρχουν ισχυρές ενδείξεις ότι παραμένεις σε συνεχή κατάσταση έντασης.",
     "me": "Το σώμα σου φαίνεται να κουβαλά μέρος της πίεσης. Μπορεί να υπάρχει μυϊκή ένταση, ασταθής ύπνος, δυσκολία να χαλαρώσεις ή μια χαμηλή αλλά επίμονη αίσθηση εσωτερικής ενεργοποίησης. Η ανάκαμψη δεν προλαβαίνει να ολοκληρωθεί.",
     "hi": "Η σωματική και νευρική επιβάρυνση είναι σημαντική. Μπορεί να νιώθεις ταυτόχρονα εξαντλημένος και σε ένταση, να μην ανακάμπτεις με τον ύπνο ή να εμφανίζεις σωματικά συμπτώματα. Το σώμα φαίνεται να εκφράζει αυτό που το μυαλό έχει μάθει να προσπερνά. Αυτή η κατάσταση σπάνια αλλάζει μόνο με περισσότερη θέληση."},
    {"id": "ta", "title": "Διαρκής σύνδεση με τη δουλειά", "ids": ["tech-activation"],
     "lo": "Μπορείς να είσαι πραγματικά εκτός δουλειάς. Όταν τελειώνει η εργασία, δεν παραμένει μονίμως ανοιχτή στο παρασκήνιο του μυαλού σου. Αυτό επιτρέπει ουσιαστική ανάκαμψη.",
     "me": "Σπάνια αισθάνεσαι ότι είσαι εντελώς εκτός. Ένα μέρος σου παραμένει σε ετοιμότητα, ελέγχει μηνύματα ή συνεχίζει να σκέφτεται τα ανοιχτά θέματα. Αυτό περιορίζει αθόρυβα την ποιότητα της ξεκούρασης.",
     "hi": "Βρίσκεσαι σχεδόν μόνιμα σε επαγγελματική εγρήγορση. Το μυαλό παραμένει συνδεδεμένο με τη δουλειά ακόμη και όταν δεν εργάζεσαι. Η αίσθηση ότι πρέπει να είσαι διαθέσιμος, ενημερωμένος ή έτοιμος να ανταποκριθείς δυσκολεύει σημαντικά την πραγματική αποφόρτιση. Αυτό είναι ένα από τα δυσκολότερα μοτίβα να αλλάξει χωρίς συνειδητό και συγκεκριμένο σχέδιο."},
]

SECLABELS = ["Χαμηλή", "Αυξημένη", "Υψηλή"]

UI = {
    "intro": {
        "h1": "Burnout Diagnostic",
        "p1": "Σκοπός του Burnout Diagnostic δεν είναι να σου δώσει διάγνωση ή να σου βάλει μια ταμπέλα.",
        "p2": "Στόχος του είναι να σου δώσει μια πρώτη, οργανωμένη εικόνα για το πώς επηρεάζουν σήμερα τη σχέση σου με τη δουλειά η πίεση, η ευθύνη, η φιλοδοξία, η ανάκαμψη, η αυτοεκτίμηση και οι σχέσεις σου.",
        "p3": "Χρειάζονται περίπου οκτώ λεπτά. Στο τέλος θα δεις το συνολικό επίπεδο επιβάρυνσης και μια ανάλυση των περιοχών που φαίνεται να σε επηρεάζουν περισσότερο. Δες το αποτέλεσμα ως αφετηρία για σκέψη και συζήτηση, όχι ως κλινική διάγνωση.",
        "cards": [["Διάρκεια", "Περίπου 8 λεπτά"], ["Μορφή", "45 ερωτήσεις, κλίμακα 1–5"], ["Αποτέλεσμα", "Συνολικό επίπεδο και ανάλυση 7 περιοχών"]],
        "note": "Ενδεικτικό εργαλείο αυτοαξιολόγησης. Δεν αποτελεί κλινική διάγνωση.",
        "start": "Ξεκίνα",
    },
    "q": {"of": "Ερώτηση {n} από {t}", "pct": "{p}% ολοκληρώθηκε", "back": "Πίσω", "next": "Επόμενη", "last": "Δες το αποτέλεσμα"},
    "gate": {"eyebrow": "Ένα τελευταίο βήμα", "h1": "Συμπλήρωσε το email σου για να δεις το αποτέλεσμα.",
             "p": "Θα δεις το επίπεδο και την ανάλυσή σου αμέσως μετά.",
             "label": "Email", "err": "Παρακαλώ συμπλήρωσε ένα έγκυρο email.",
             "back": "Πίσω", "show": "Δες το αποτέλεσμα"},
    "res": {"eyebrow": "Το αποτέλεσμά σου", "score": "Συνολικό σκορ:", "suffix": "/ 5",
            "highest": "Η περιοχή με τη μεγαλύτερη επιβάρυνση αυτή τη στιγμή είναι:",
            "meansHeading": "Τι σημαίνει πρακτικά",
            "note": "Το αποτέλεσμα είναι ενδεικτικό και δεν αποτελεί κλινική διάγνωση.",
            "dimHeading": "Ανάλυση ανά περιοχή — από τη μεγαλύτερη προς τη μικρότερη επιβάρυνση",
            "ctaEyebrow": "Τι μπορείς να κάνεις από εδώ",
            "ctaCopy": "Το αποτέλεσμα δείχνει πού φαίνεται να συγκεντρώνεται το μεγαλύτερο φορτίο. Δεν αλλάζει όμως από μόνο του τον τρόπο που δουλεύεις, αντιδράς ή εξαντλείσαι. Αν αναγνώρισες κάτι σημαντικό στο αποτέλεσμα, μπορείς να επικοινωνήσεις μαζί μου. Θα δούμε τι συμβαίνει, τι χρειάζεσαι και αν έχει νόημα να δουλέψουμε μαζί.",
            "ctaBtn": "Επικοινωνία", "retake": "Κάνε το ξανά", "print": "Εκτύπωση"},
}

DIAG_STYLE = """
<style>
#diag-app .eyebrow{font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#666;line-height:1.7}
#diag-app .dh1{font-size:32px;font-weight:400;line-height:1.35;margin-bottom:1.5rem}
#diag-app .dp{margin-bottom:1.4rem;line-height:1.75;font-size:18px}
#diag-app .note{font-size:14px;color:#767676;line-height:1.7}
#diag-app .dcard{border:1px solid rgba(40,39,38,.15);padding:1rem;border-radius:8px}
#diag-app .opt{width:100%;text-align:left;border:1px solid rgba(40,39,38,.15);padding:1rem;border-radius:8px;background:transparent;color:#282726;font-family:inherit;font-size:16px;line-height:1.7;cursor:pointer;margin-bottom:.75rem;transition:border-color .12s,background .12s}
#diag-app .opt:hover{border-color:rgba(26,127,55,.6);background:rgba(26,127,55,.04)}
#diag-app .opt.sel{border:1px solid #1a7f37;background:#1a7f37;color:#fff}
#diag-app .qh{font-size:20px;line-height:1.85;margin-bottom:1.8rem;font-weight:400}
#diag-app .pline{height:1px;background:rgba(40,39,38,.12);margin-top:.8rem}
#diag-app .pfill{height:1px;background:#1a7f37;transition:width .2s ease}
#diag-app .nav{display:flex;justify-content:space-between;gap:1rem;margin-top:2rem}
#diag-app input[type=email]{width:100%;border:1px solid rgba(40,39,38,.2);padding:1rem;border-radius:8px;background:transparent;color:#282726;font-family:inherit;font-size:15px;outline:none}
#diag-app .drow{border:1px solid rgba(40,39,38,.15);padding:1rem;border-radius:8px;margin-bottom:.75rem}
#diag-app .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin:2rem 0}
@media(max-width:767px){#diag-app .dh1{font-size:24px}#diag-app .grid3{grid-template-columns:1fr}}
</style>
"""


# EmailJS lead-notification. Reuses the same keys as aggelosmouzakitis.com so the
# emails land in the same inbox. Add the .gr domain (and the *.github.io preview host)
# to EmailJS "Allowed Origins" (Account -> Security) or sends from the new domain are
# blocked. Swap these for a Greek-specific service/template/key to keep GR leads apart.
EMAILJS_SNIPPET = (
    '<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>'
    '<script>(function(){if(window.emailjs){emailjs.init({publicKey:"bfBcHLXj2nKaev_lT"});}})();</script>'
)


def render(head, sidebar, footer, mobile_nav, JS, rel):
    d = 1
    slug = "burnout-diagnostic"
    ft = footer(d)
    data = ("var SECTIONS=" + json.dumps(SECTIONS, ensure_ascii=False) + ";"
            "var SCALE=" + json.dumps(SCALE, ensure_ascii=False) + ";"
            "var LEVELS=" + json.dumps(LEVELS, ensure_ascii=False) + ";"
            "var DIMS=" + json.dumps(DIMS, ensure_ascii=False) + ";"
            "var SECLABELS=" + json.dumps(SECLABELS, ensure_ascii=False) + ";"
            "var UI=" + json.dumps(UI, ensure_ascii=False) + ";")
    diag_js = DIAG_JS.replace("/*__DATA__*/", data).replace(
        "__FOOTER__", ft.replace("\\", "\\\\").replace("`", "\\`").replace("</", "<\\/"))
    return (head(TITLE, DESC, slug, d, "img/og/burnout-diagnostic.png", bc="Burnout Diagnostic")
            + EMAILJS_SNIPPET
            + '<div id="root">' + sidebar(slug, d)
            + '<div id="main-scroll"><main id="main" class="wrap">' + DIAG_STYLE
            + '<div id="diag-app"></div>' + '</main></div></div>'
            + mobile_nav(slug, d) + JS + diag_js + "\n</body>\n</html>\n")


DIAG_JS = r"""
<script>
(function(){
  var BOOK={mail:"mailto:aggelos.mouzakitis@gmail.com?subject=Burnout%20Diagnostic"};
  var SHEET_URL="https://script.google.com/macros/s/AKfycby-gv3oCFT2q5KXvVnqRzS4PAzcMjPB8Gls5qodZJ3v4_9HKGqJHMdBCw7YYbEzIE2d/exec";
  var EJS={service:"service_i4xq7vg",template:"template_wdsrbdo"};
  // Identifier so GR leads are distinguishable from the .com (EN) ones in the same
  // inbox / Sheet. Sent as `source` and `site`. Shows in the email if the EmailJS
  // template references {{source}} (add it to the body and/or the Subject line).
  var SOURCE="GR — aggelosmouzakitis.gr";
  function validEmail(e){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);}
  var FOOTER=`__FOOTER__`;
  /*__DATA__*/

  var FLAT=[]; SECTIONS.forEach(function(s){s.q.forEach(function(t,i){FLAT.push({key:s.id+'-'+i,sec:s.title,text:t});});});
  function avg(a){if(!a.length)return null;return a.reduce(function(x,y){return x+y;},0)/a.length;}
  function fmt(s){return s===null?'N/A':s.toFixed(2);}
  function levelFor(s){for(var i=0;i<LEVELS.length;i++){if(s<=LEVELS[i].max)return LEVELS[i];}return LEVELS[LEVELS.length-1];}
  function grade(s){return s===null?'Ανεπαρκή δεδομένα':levelFor(s).grade;}
  function desc(s){return s===null?'':levelFor(s).desc;}
  function nextStep(s){return s===null?'':levelFor(s).next;}
  function secLabel(s){if(s===null)return 'Ανεπαρκή δεδομένα';if(s<=2.5)return SECLABELS[0];if(s<=3.2)return SECLABELS[1];return SECLABELS[2];}
  function levelVis(s){if(s===null)return{c:'#bbb',p:0};var p=Math.max(0,Math.min(100,((s-1)/4)*100));if(s<=2.5)return{c:'#1a7f37',p:p};if(s<=3.2)return{c:'#d9a200',p:p};return{c:'#c0392b',p:p};}
  function pick(dm,s){if(s===null)return dm.me;if(s<=2.5)return dm.lo;if(s<=3.2)return dm.me;return dm.hi;}

  var state={screen:'intro',answers:{},idx:0,email:'',results:null};
  var root=document.getElementById('diag-app');
  function scoreSections(){return SECTIONS.map(function(sec){var keys=sec.q.map(function(_,i){return sec.id+'-'+i;});var nums=keys.map(function(k){return state.answers[k];}).filter(function(v){return typeof v==='number';});var ans=keys.filter(function(k){return state.answers[k]!==undefined;}).length;var th=Math.ceil(keys.length*0.7);var sc=ans>=th?avg(nums):null;return{id:sec.id,title:sec.title,key:sec.key,score:sc,label:secLabel(sc)};});}
  function scoreDims(){return DIMS.map(function(dm){var keys=[];dm.ids.forEach(function(sid){var sec=SECTIONS.filter(function(s){return s.id===sid;})[0];if(sec)sec.q.forEach(function(_,i){keys.push(sid+'-'+i);});});var nums=keys.map(function(k){return state.answers[k];}).filter(function(v){return typeof v==='number';});var ans=keys.filter(function(k){return state.answers[k]!==undefined;}).length;var th=Math.ceil(keys.length*0.7);var sc=ans>=th?avg(nums):null;return{title:dm.title,score:sc,label:secLabel(sc),interp:pick(dm,sc)};});}
  function overall(){var nums=Object.keys(state.answers).map(function(k){return state.answers[k];}).filter(function(v){return typeof v==='number';});return avg(nums);}
  function calc(){var ov=overall();var dims=scoreDims();var sorted=dims.slice().sort(function(a,b){var av=typeof a.score==='number'?a.score:-1;var bv=typeof b.score==='number'?b.score:-1;return bv-av;});var top=null;dims.forEach(function(d){if(typeof d.score==='number'&&(!top||d.score>top.score))top=d;});return{overall:ov,grade:grade(ov),desc:desc(ov),next:nextStep(ov),dims:sorted,top:top,sections:scoreSections()};}
  function buildBreakdown(sections){return sections.map(function(s){return s.title+': '+s.label+' ('+fmt(s.score)+' / 5.00)';}).join('\n');}
  function buildAnswers(){return FLAT.map(function(q,i){var a=state.answers[q.key];var al=a===undefined?'Καμία απάντηση':(a==='na'?'Δ/Α':String(a));return (i+1)+'. ['+q.sec+'] '+q.text+' => '+al;}).join('\n');}
  function postSheet(cal){try{var body={source:SOURCE,site:'gr',email:state.email.trim(),overall_score:fmt(cal.overall),overall_grade:cal.grade,section_breakdown:buildBreakdown(cal.sections),all_answers:buildAnswers(),page_url:location.href};cal.sections.forEach(function(s){body[s.key]=fmt(s.score);});fetch(SHEET_URL,{method:'POST',mode:'no-cors',body:JSON.stringify(body)}).catch(function(){});}catch(e){}}
  function sendEmail(cal){if(!window.emailjs)return;try{emailjs.send(EJS.service,EJS.template,{source:SOURCE,site:'gr',user_email:state.email.trim(),overall_score:fmt(cal.overall),overall_grade:cal.grade,section_breakdown:buildBreakdown(cal.sections),all_answers:buildAnswers(),page_url:location.href}).catch(function(){});}catch(e){}}

  function render(){
    var totalQ=FLAT.length;
    var answered=Object.keys(state.answers).filter(function(k){return state.answers[k]!==undefined;}).length;
    var progress=Math.round(answered/totalQ*100);
    var h='';
    if(state.screen==='intro'){
      var I=UI.intro;
      h+='<h1 class="dh1">'+I.h1+'</h1>';
      h+='<p class="dp">'+I.p1+'</p><p class="dp">'+I.p2+'</p><p class="dp">'+I.p3+'</p>';
      h+='<div class="grid3">';
      I.cards.forEach(function(x){h+='<div class="dcard"><div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6e6e6e;margin-bottom:.5rem">'+x[0]+'</div><div>'+x[1]+'</div></div>';});
      h+='</div>';
      h+='<p class="note">'+I.note+'</p>';
      h+='<div style="margin-top:2rem"><button class="cta-btn" id="d-start">'+I.start+'</button></div>';
      h+=FOOTER;
    } else if(state.screen==='question'){
      var q=FLAT[state.idx];var cur=state.answers[q.key];var Q=UI.q;
      h+='<div style="margin-bottom:2rem"><div style="display:flex;justify-content:space-between;gap:1rem;margin-bottom:.8rem"><p class="eyebrow">'+Q.of.replace('{n}',state.idx+1).replace('{t}',totalQ)+'</p><p class="eyebrow">'+Q.pct.replace('{p}',progress)+'</p></div><div class="pline"><div class="pfill" style="width:'+progress+'%"></div></div></div>';
      h+='<h2 class="qh">'+q.text+'</h2>';
      SCALE.forEach(function(o){h+='<button class="opt'+(cur===o.v?' sel':'')+'" data-v="'+o.v+'">'+o.l+'</button>';});
      h+='<div class="nav"><button class="cta-ghost" id="d-back" '+(state.idx===0?'disabled style="opacity:.4"':'')+'>'+Q.back+'</button>';
      h+='<button class="cta-btn" id="d-next" '+(cur===undefined?'disabled style="opacity:.4"':'')+'>'+(state.idx===totalQ-1?Q.last:Q.next)+'</button></div>';
    } else if(state.screen==='gate'){
      var G=UI.gate;
      h+='<p class="eyebrow">'+G.eyebrow+'</p><h1 class="dh1">'+G.h1+'</h1><p class="dp">'+G.p+'</p>';
      h+='<label style="display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6e6e6e;margin-bottom:.6rem">'+G.label+'</label>';
      h+='<input type="email" id="d-email" placeholder="you@example.com" value="'+state.email.replace(/"/g,'&quot;')+'">';
      h+='<div id="d-emailerr" style="display:none;color:#c0392b;font-size:13px;margin-top:.5rem">'+G.err+'</div>';
      h+='<div class="nav"><button class="cta-ghost" id="d-back2">'+G.back+'</button><button class="cta-btn" id="d-show">'+G.show+'</button></div>';
    } else if(state.screen==='results'&&state.results){
      var r=state.results;var R=UI.res;
      h+='<p class="eyebrow">'+R.eyebrow+'</p>';
      h+='<h1 class="dh1" style="margin-bottom:.5rem">'+r.grade+'</h1>';
      h+='<p class="dp">'+R.score+' <span style="color:#1a7f37">'+fmt(r.overall)+'</span> '+R.suffix+'</p>';
      if(r.top)h+='<p class="dp">'+R.highest+' <span style="border-bottom:1px solid rgba(40,39,38,.3)">'+r.top.title+'</span></p>';
      h+='<p class="dp">'+r.desc+'</p>';
      if(r.next)h+='<div style="border-left:2px solid #1a7f37;padding:2px 0 2px 14px;margin:1.6rem 0"><p class="eyebrow" style="margin-bottom:.5rem">'+R.meansHeading+'</p><p class="dp" style="margin-bottom:0">'+r.next+'</p></div>';
      h+='<p class="note">'+R.note+'</p>';
      h+='<div style="margin-top:2rem"><p class="eyebrow" style="margin-bottom:1rem">'+R.dimHeading+'</p>';
      r.dims.forEach(function(d){var v=levelVis(d.score);h+='<div class="drow"><div style="display:flex;justify-content:space-between;gap:1rem"><div>'+d.title+'</div><div style="text-align:right;flex-shrink:0"><div style="color:'+v.c+'">'+d.label+'</div><div style="font-size:13px;color:#6e6e6e">'+fmt(d.score)+' '+R.suffix+'</div></div></div><div style="height:3px;background:rgba(40,39,38,.08);border-radius:2px;margin:.6rem 0"><div style="height:3px;width:'+v.p+'%;background:'+v.c+';border-radius:2px"></div></div><div style="font-size:13px;color:#767676;line-height:1.65">'+d.interp+'</div></div>';});
      h+='</div>';
      h+='<div style="border:1px solid rgba(26,127,55,0.3);background:rgba(26,127,55,0.04);padding:1.4rem;margin-top:2.5rem"><p class="eyebrow" style="margin-bottom:.6rem">'+R.ctaEyebrow+'</p><p class="dp" style="margin-bottom:1.2rem">'+R.ctaCopy+'</p><a class="cta-btn" href="'+BOOK.mail+'">'+R.ctaBtn+'</a></div>';
      h+='<div style="display:flex;gap:1rem;margin-top:2rem;flex-wrap:wrap"><button class="cta-ghost" id="d-retake">'+R.retake+'</button><button class="cta-ghost" id="d-print">'+R.print+'</button></div>';
      h+=FOOTER;
    }
    root.innerHTML=h; bind();
  }
  function bind(){
    var s=document.getElementById('d-start');if(s)s.onclick=function(){state.screen='question';state.idx=0;render();window.scrollTo(0,0);};
    document.querySelectorAll('#diag-app .opt').forEach(function(b){b.onclick=function(){var v=b.getAttribute('data-v');state.answers[FLAT[state.idx].key]=(v==='na'?'na':parseInt(v,10));render();};});
    var bk=document.getElementById('d-back');if(bk)bk.onclick=function(){if(state.idx>0){state.idx--;render();window.scrollTo(0,0);}};
    var nx=document.getElementById('d-next');if(nx)nx.onclick=function(){if(state.idx<FLAT.length-1){state.idx++;render();window.scrollTo(0,0);}else{state.screen='gate';render();window.scrollTo(0,0);}};
    var b2=document.getElementById('d-back2');if(b2)b2.onclick=function(){state.screen='question';render();window.scrollTo(0,0);};
    var em=document.getElementById('d-email');if(em)em.oninput=function(){state.email=em.value;};
    var sh=document.getElementById('d-show');if(sh)sh.onclick=function(){var em=(state.email||'').trim();if(!validEmail(em)){var er=document.getElementById('d-emailerr');if(er)er.style.display='block';return;}state.results=calc();postSheet(state.results);sendEmail(state.results);state.screen='results';render();window.scrollTo(0,0);};
    var rt=document.getElementById('d-retake');if(rt)rt.onclick=function(){state={screen:'intro',answers:{},idx:0,email:'',results:null};render();window.scrollTo(0,0);};
    var pr=document.getElementById('d-print');if(pr)pr.onclick=function(){window.print();};
  }
  render();
})();
</script>
"""
