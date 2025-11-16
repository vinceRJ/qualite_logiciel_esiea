 Feature: Gestion des tâches
 Scenario: Ajouter une tâche
 Given je suis sur la page TodoMVC
 When j’ajoute la tâche "Acheter du café"
 Then la tâche "Acheter du café" est visible dans la liste