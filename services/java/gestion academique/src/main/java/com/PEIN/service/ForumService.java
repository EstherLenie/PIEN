package com.PEIN.service;

import org.springframework.stereotype.Service;

import com.PEIN.pojos.*;
import com.PEIN.repository.ClasseRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class ForumService {

    // private final ClasseRepository repository;
    //
    // public ForumService(ClasseRepository repository) {
    // this.repository = repository;
    // }
    //
    // // Ajouter un membre à un forum
    // public void addMember(String classeId, String forumId, Membre membre) {
    // Classe classe = repository.findById(classeId);
    // if (classe != null && classe.getForumId() != null) {
    // Forum forum = classe.getForumId().stream()
    // .filter(f -> f.getId().equals(forumId))
    // .findFirst()
    // .orElse(null);
    // if (forum != null) {
    // if (forum.getMembre() == null) {
    // forum.setMembre(new ArrayList<>());
    // }
    // forum.getMembre().add(membre);
    // }
    // }
    // }
    //
    // // Ajouter une discussion à un forum
    // public void ajouterDiscussion(String classeId, String forumId, Discussion
    // discussion) {
    // Classe classe = repository.findById(classeId);
    // if (classe != null && classe.getForumId() != null) {
    // Forum forum = classe.getForumId().stream()
    // .filter(f -> f.getId().equals(forumId))
    // .findFirst()
    // .orElse(null);
    // if (forum != null) {
    // if (forum.getDiscussionId() == null) {
    // forum.setDiscussionId(new ArrayList<>());
    // }
    // discussion.setId(java.util.UUID.randomUUID().toString());
    // discussion.setPosteLe(LocalDateTime.now());
    // forum.getDiscussionId().add(discussion);
    // }
    // }
    // }
    //
    // // Ajouter une réponse à une discussion
    // public void ajouterReponse(String classeId, String forumId, String
    // discussionId, Reponse reponse) {
    // Classe classe = repository.findById(classeId);
    // if (classe != null && classe.getForumId() != null) {
    // Forum forum = classe.getForumId().stream()
    // .filter(f -> f.getId().equals(forumId))
    // .findFirst()
    // .orElse(null);
    // if (forum != null && forum.getDiscussionId() != null) {
    // Discussion discussion = forum.getDiscussionId().stream()
    // .filter(d -> d.getId().equals(discussionId))
    // .findFirst()
    // .orElse(null);
    // if (discussion != null) {
    // if (discussion.getReponse() == null) {
    // discussion.setReponse(new ArrayList<>());
    // }
    // reponse.setId(java.util.UUID.randomUUID().toString());
    // reponse.setPosteLe(LocalDateTime.now());
    // discussion.getReponse().add(reponse);
    // }
    // }
    // }
    // }
}
